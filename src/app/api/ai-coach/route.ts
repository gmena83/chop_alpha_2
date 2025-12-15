import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { getAiCoachResponse, ChatMessage } from '@/lib/ai-coach';
import { logAuditEvent } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { messages, locale = 'en' } = body as { 
      messages: ChatMessage[]; 
      locale?: 'en' | 'es' 
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const response = await getAiCoachResponse(messages, locale);

    await logAuditEvent({
      actorUserId: session.user.id,
      action: 'ai_coach_query',
      targetType: 'ai_conversation',
      metadata: {
        messageCount: messages.length,
        tokensUsed: response.tokensUsed,
        wasEscalated: response.shouldEscalate,
        locale
      },
      ipAddress: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined
    });

    return NextResponse.json({
      message: response.content,
      shouldEscalate: response.shouldEscalate,
      escalationReason: response.escalationReason
    });
  } catch (error) {
    console.error('AI Coach error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
