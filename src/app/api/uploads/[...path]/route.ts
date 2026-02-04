import { NextRequest, NextResponse } from 'next/server';
import { Storage } from "@google-cloud/storage";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const objectPath = path.join('/');

    const privateObjectDir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!privateObjectDir) {
      return NextResponse.json({ error: 'Object storage not configured' }, { status: 500 });
    }

    const parts = privateObjectDir.split('/').filter(Boolean);
    const bucketName = parts[0];
    const fullObjectName = parts.length > 1 
      ? `${parts.slice(1).join('/')}/${objectPath}`
      : objectPath;

    const bucket = objectStorageClient.bucket(bucketName);
    const file = bucket.file(fullObjectName);

    const [exists] = await file.exists();
    if (!exists) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const [metadata] = await file.getMetadata();
    const [buffer] = await file.download();

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': metadata.contentType || 'application/octet-stream',
        'Content-Length': String(metadata.size),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}
