import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { randomUUID } from 'crypto';

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const ADMIN_ROLES = ['admin', 'super_admin', 'research_staff'];

async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec,
}: {
  bucketName: string;
  objectName: string;
  method: "GET" | "PUT" | "DELETE" | "HEAD";
  ttlSec: number;
}): Promise<string> {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, errorcode: ${response.status}`
    );
  }

  const { signed_url: signedURL } = await response.json();
  return signedURL;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !ADMIN_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { name, size, contentType } = body;

    if (!name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }

    const privateObjectDir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!privateObjectDir) {
      return NextResponse.json({ error: 'Object storage not configured' }, { status: 500 });
    }

    const objectId = randomUUID();
    const extension = name.includes('.') ? name.split('.').pop() : '';
    const objectName = extension ? `uploads/videos/${objectId}.${extension}` : `uploads/videos/${objectId}`;
    
    const parts = privateObjectDir.split('/').filter(Boolean);
    const bucketName = parts[0];
    const fullObjectName = parts.length > 1 
      ? `${parts.slice(1).join('/')}/${objectName}`
      : objectName;

    const uploadURL = await signObjectURL({
      bucketName,
      objectName: fullObjectName,
      method: "PUT",
      ttlSec: 900,
    });

    const objectPath = `/objects/${objectName}`;

    return NextResponse.json({
      uploadURL,
      objectPath,
      metadata: { name, size, contentType },
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
