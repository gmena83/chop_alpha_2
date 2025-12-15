import OpenAI from "openai";

// Defensive check for OpenAI credentials
const isOpenAIConfigured = Boolean(
  process.env.AI_INTEGRATIONS_OPENAI_API_KEY && 
  process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
);

// Only instantiate OpenAI client if credentials are available
const openai = isOpenAIConfigured 
  ? new OpenAI({
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
    })
  : null;

export function isAiCoachAvailable(): boolean {
  return isOpenAIConfigured && openai !== null;
}

const SYSTEM_PROMPT_EN = `You are a supportive AI coaching assistant for the ETA (Executive Transition for Autism/ADHD) Platform, developed by Children's Hospital of Philadelphia (CHOP). Your role is to help parents of neurodivergent teens navigate the journey to driving independence.

GUIDELINES:
1. Provide evidence-based, supportive guidance focused on driving readiness for neurodivergent teens
2. Be warm, encouraging, and non-judgmental in your responses
3. Focus on practical strategies that can help families
4. If asked about medical advice, diagnoses, or treatment, politely redirect to their healthcare provider
5. If a question is outside your expertise or involves safety concerns, recommend they contact their coach or healthcare professional
6. Keep responses concise but helpful (aim for 2-4 paragraphs)
7. When relevant, mention that the platform's modules contain more detailed information

TOPICS YOU CAN HELP WITH:
- General questions about driving readiness for neurodivergent teens
- Strategies for building executive function skills
- Tips for practicing driving with their teen
- Understanding the permit and licensing process
- Managing anxiety around driving
- Communication strategies between parents and teens
- Progress tracking and celebrating milestones

LIMITATIONS:
- Do not provide specific medical or therapeutic advice
- Do not diagnose conditions
- Do not recommend medication changes
- Always encourage professional consultation for safety concerns`;

const SYSTEM_PROMPT_ES = `Eres un asistente de coaching de IA de apoyo para la Plataforma ETA (Transición Ejecutiva para Autismo/TDAH), desarrollada por el Hospital Infantil de Filadelfia (CHOP). Tu rol es ayudar a los padres de adolescentes neurodivergentes a navegar el camino hacia la independencia de conducir.

PAUTAS:
1. Proporciona orientación basada en evidencia y de apoyo enfocada en la preparación para conducir de adolescentes neurodivergentes
2. Sé cálido, alentador y sin juicios en tus respuestas
3. Enfócate en estrategias prácticas que puedan ayudar a las familias
4. Si te preguntan sobre consejos médicos, diagnósticos o tratamiento, redirige amablemente a su proveedor de atención médica
5. Si una pregunta está fuera de tu experiencia o involucra preocupaciones de seguridad, recomienda que contacten a su coach o profesional de salud
6. Mantén las respuestas concisas pero útiles (apunta a 2-4 párrafos)
7. Cuando sea relevante, menciona que los módulos de la plataforma contienen información más detallada

TEMAS EN LOS QUE PUEDES AYUDAR:
- Preguntas generales sobre la preparación para conducir de adolescentes neurodivergentes
- Estrategias para desarrollar habilidades de función ejecutiva
- Consejos para practicar la conducción con su adolescente
- Comprensión del proceso de permiso y licencia
- Manejo de la ansiedad relacionada con conducir
- Estrategias de comunicación entre padres y adolescentes
- Seguimiento del progreso y celebración de hitos

LIMITACIONES:
- No proporciones consejos médicos o terapéuticos específicos
- No diagnostiques condiciones
- No recomiendes cambios de medicación
- Siempre alienta la consulta profesional para preocupaciones de seguridad`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AiCoachResponse {
  content: string;
  shouldEscalate: boolean;
  escalationReason?: string;
  tokensUsed: number;
}

const ESCALATION_KEYWORDS = [
  'suicide', 'self-harm', 'hurt myself', 'hurt themselves',
  'emergency', 'crisis', 'danger', 'abuse', 'violence',
  'suicidio', 'autolesión', 'hacerme daño', 'emergencia', 'crisis', 'peligro', 'abuso', 'violencia'
];

function checkForEscalation(message: string): { shouldEscalate: boolean; reason?: string } {
  const lowerMessage = message.toLowerCase();
  for (const keyword of ESCALATION_KEYWORDS) {
    if (lowerMessage.includes(keyword)) {
      return { 
        shouldEscalate: true, 
        reason: `Message contains sensitive keyword: ${keyword}` 
      };
    }
  }
  return { shouldEscalate: false };
}

export async function getAiCoachResponse(
  messages: ChatMessage[],
  locale: 'en' | 'es' = 'en'
): Promise<AiCoachResponse> {
  // Check if AI coaching is available
  if (!openai) {
    const unavailableMessage = locale === 'es'
      ? 'El asistente de IA no está disponible en este momento. Por favor, contacte a su coach directamente para obtener ayuda.'
      : 'AI assistant is not available at this time. Please contact your coach directly for assistance.';
    
    return {
      content: unavailableMessage,
      shouldEscalate: false,
      tokensUsed: 0
    };
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage) {
    const escalationCheck = checkForEscalation(lastMessage.content);
    if (escalationCheck.shouldEscalate) {
      const crisisResponse = locale === 'es' 
        ? 'Noto que puede estar pasando por un momento difícil. Su bienestar es importante para nosotros. Por favor, contacte a su coach o profesional de salud directamente, o llame al 988 (Línea de Prevención del Suicidio y Crisis) si necesita apoyo inmediato.'
        : 'I notice you may be going through a difficult time. Your wellbeing is important to us. Please reach out to your coach or healthcare professional directly, or call 988 (Suicide and Crisis Lifeline) if you need immediate support.';
      
      return {
        content: crisisResponse,
        shouldEscalate: true,
        escalationReason: escalationCheck.reason,
        tokensUsed: 0
      };
    }
  }

  const systemPrompt = locale === 'es' ? SYSTEM_PROMPT_ES : SYSTEM_PROMPT_EN;
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
      max_tokens: 1024,
      temperature: 0.7
    });

    const content = response.choices[0]?.message?.content || '';
    const tokensUsed = (response.usage?.prompt_tokens || 0) + (response.usage?.completion_tokens || 0);

    return {
      content,
      shouldEscalate: false,
      tokensUsed
    };
  } catch (error) {
    console.error('AI Coach error:', error);
    const errorMessage = locale === 'es'
      ? 'Lo siento, no pude procesar su solicitud en este momento. Por favor, intente de nuevo más tarde o contacte a su coach.'
      : 'Sorry, I could not process your request at this time. Please try again later or contact your coach.';
    
    return {
      content: errorMessage,
      shouldEscalate: false,
      tokensUsed: 0
    };
  }
}
