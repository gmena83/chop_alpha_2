import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { assessments, assessmentQuestions, recommendations } from '@/db/schema';
import { eq } from 'drizzle-orm';

const FES_SLUG = 'family-empowerment-scale';

const FES_QUESTIONS = [
  { en: "I feel that I have a right to approve all services my child receives.", es: "Siento que tengo derecho a aprobar todos los servicios que recibe mi hijo/a.", domain: 'family' },
  { en: "When problems arise with my child, I handle them pretty well.", es: "Cuando surgen problemas con mi hijo/a, los manejo bastante bien.", domain: 'family' },
  { en: "I feel confident in my ability to help my child grow and develop.", es: "Me siento seguro/a de mi capacidad para ayudar a mi hijo/a a crecer y desarrollarse.", domain: 'family' },
  { en: "I know the steps to take when I am concerned about services my child is receiving.", es: "Sé los pasos a seguir cuando me preocupan los servicios que recibe mi hijo/a.", domain: 'family' },
  { en: "I am able to make good decisions about what services my child needs.", es: "Soy capaz de tomar buenas decisiones sobre qué servicios necesita mi hijo/a.", domain: 'family' },
  { en: "I am able to work with agencies and professionals to decide what services my child needs.", es: "Soy capaz de trabajar con agencias y profesionales para decidir qué servicios necesita mi hijo/a.", domain: 'family' },
  { en: "I make sure that professionals understand my opinions about what services my child needs.", es: "Me aseguro de que los profesionales entiendan mis opiniones sobre qué servicios necesita mi hijo/a.", domain: 'family' },
  { en: "I know what services my child needs.", es: "Sé qué servicios necesita mi hijo/a.", domain: 'family' },
  { en: "When I need help with problems in my family, I am able to ask for help from others.", es: "Cuando necesito ayuda con problemas en mi familia, soy capaz de pedir ayuda a otros.", domain: 'family' },
  { en: "I make efforts to learn new ways to help my child grow and develop.", es: "Hago esfuerzos para aprender nuevas formas de ayudar a mi hijo/a a crecer y desarrollarse.", domain: 'family' },
  { en: "When dealing with my child, I focus on the good things as well as the problems.", es: "Al tratar con mi hijo/a, me enfoco en las cosas buenas así como en los problemas.", domain: 'family' },
  { en: "When faced with a problem involving my child, I decide what to do and then do it.", es: "Cuando enfrento un problema con mi hijo/a, decido qué hacer y luego lo hago.", domain: 'family' },
  { en: "I feel my family life is under control.", es: "Siento que mi vida familiar está bajo control.", domain: 'service' },
  { en: "I understand how the service system for children with disabilities is organized.", es: "Entiendo cómo está organizado el sistema de servicios para niños con discapacidades.", domain: 'service' },
  { en: "I am able to get information to help me better understand my child.", es: "Soy capaz de obtener información para ayudarme a entender mejor a mi hijo/a.", domain: 'service' },
  { en: "I believe that I can solve problems with my child when they happen.", es: "Creo que puedo resolver problemas con mi hijo/a cuando ocurren.", domain: 'service' },
  { en: "I know what to do when problems arise with my child.", es: "Sé qué hacer cuando surgen problemas con mi hijo/a.", domain: 'service' },
  { en: "I feel I am a good parent.", es: "Siento que soy un buen padre/madre.", domain: 'service' },
  { en: "I know about the services available for children with disabilities.", es: "Conozco los servicios disponibles para niños con discapacidades.", domain: 'service' },
  { en: "I get in touch with my legislators when important bills or issues concerning children are pending.", es: "Me pongo en contacto con mis legisladores cuando hay proyectos de ley o asuntos importantes sobre niños pendientes.", domain: 'community' },
  { en: "I tell people in agencies and government how services for children can be improved.", es: "Les digo a las personas en agencias y el gobierno cómo se pueden mejorar los servicios para niños.", domain: 'community' },
  { en: "I help other families get the services they need.", es: "Ayudo a otras familias a obtener los servicios que necesitan.", domain: 'community' },
  { en: "I tell others what I think about services that need improvement.", es: "Les digo a otros lo que pienso sobre los servicios que necesitan mejoras.", domain: 'community' },
  { en: "I understand how the service system for children is organized.", es: "Entiendo cómo está organizado el sistema de servicios para niños.", domain: 'community' },
  { en: "I feel that my opinion is just as important as professionals' opinions in deciding what services my child needs.", es: "Siento que mi opinión es tan importante como las opiniones de los profesionales al decidir qué servicios necesita mi hijo/a.", domain: 'community' },
  { en: "I know the rights that parents and children have under special education laws.", es: "Conozco los derechos que tienen los padres y los niños bajo las leyes de educación especial.", domain: 'community' },
  { en: "I feel I can have a part in improving services for children in my community.", es: "Siento que puedo participar en mejorar los servicios para niños en mi comunidad.", domain: 'community' },
  { en: "I make sure I stay in regular contact with professionals who are providing services to my child.", es: "Me aseguro de mantener contacto regular con los profesionales que brindan servicios a mi hijo/a.", domain: 'community' },
  { en: "I have ideas about the ideal service system for children.", es: "Tengo ideas sobre el sistema de servicios ideal para niños.", domain: 'community' },
  { en: "My opinion is just as important as professionals' opinions in deciding what services my child needs.", es: "Mi opinión es tan importante como las opiniones de los profesionales al decidir qué servicios necesita mi hijo/a.", domain: 'community' },
  { en: "Professionals should ask me what services I want for my child.", es: "Los profesionales deberían preguntarme qué servicios quiero para mi hijo/a.", domain: 'community' },
  { en: "I have a good understanding of the service system that my child is involved in.", es: "Tengo una buena comprensión del sistema de servicios en el que está involucrado mi hijo/a.", domain: 'community' },
  { en: "When necessary, I take the initiative in looking for services for my child and family.", es: "Cuando es necesario, tomo la iniciativa de buscar servicios para mi hijo/a y mi familia.", domain: 'community' },
  { en: "I believe I can solve problems with services for my child when they happen.", es: "Creo que puedo resolver problemas con los servicios para mi hijo/a cuando ocurren.", domain: 'community' }
];

const LIKERT_OPTIONS_EN = [
  { value: '1', label: 'Not True At All' },
  { value: '2', label: 'Mostly Not True' },
  { value: '3', label: 'Somewhat True' },
  { value: '4', label: 'Mostly True' },
  { value: '5', label: 'Very True' }
];

const LIKERT_OPTIONS_ES = [
  { value: '1', label: 'Nada Cierto' },
  { value: '2', label: 'Mayormente No Cierto' },
  { value: '3', label: 'Algo Cierto' },
  { value: '4', label: 'Mayormente Cierto' },
  { value: '5', label: 'Muy Cierto' }
];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (!['admin', 'super_admin'].includes(userRole || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const existing = await db.query.assessments.findFirst({
      where: eq(assessments.slug, FES_SLUG)
    });

    if (existing) {
      return NextResponse.json({ 
        message: 'Family Empowerment Scale assessment already exists',
        assessmentId: existing.id 
      });
    }

    const [assessment] = await db.insert(assessments).values({
      slug: FES_SLUG,
      titleEn: 'Family Empowerment Scale (FES)',
      titleEs: 'Escala de Empoderamiento Familiar (FES)',
      descriptionEn: 'The Family Empowerment Scale measures your sense of empowerment as a parent of a child with special needs. This helps us understand how to better support your family.',
      descriptionEs: 'La Escala de Empoderamiento Familiar mide su sentido de empoderamiento como padre/madre de un niño con necesidades especiales. Esto nos ayuda a entender cómo apoyar mejor a su familia.',
      instructionsEn: 'Please rate how true each statement is for you. There are no right or wrong answers - we want to understand your experience.',
      instructionsEs: 'Por favor califique qué tan cierto es cada enunciado para usted. No hay respuestas correctas o incorrectas - queremos entender su experiencia.',
      estimatedMinutes: 15,
      passingScore: null,
      maxScore: 170
    }).returning();

    const questionsToInsert = FES_QUESTIONS.map((q, index) => ({
      assessmentId: assessment.id,
      orderIndex: index + 1,
      questionType: 'likert_scale' as const,
      questionTextEn: q.en,
      questionTextEs: q.es,
      helpTextEn: null,
      helpTextEs: null,
      optionsEn: LIKERT_OPTIONS_EN,
      optionsEs: LIKERT_OPTIONS_ES,
      correctAnswer: null,
      points: 5,
      isRequired: true,
      isActive: true
    }));

    await db.insert(assessmentQuestions).values(questionsToInsert);

    await db.insert(recommendations).values([
      {
        assessmentId: assessment.id,
        conditionType: 'score_below',
        conditionValue: { threshold: 68 },
        recommendationType: 'resource',
        priority: 1,
        titleEn: 'Building Family Empowerment',
        titleEs: 'Construyendo el Empoderamiento Familiar',
        bodyEn: 'Your responses suggest you may benefit from additional support in advocating for your family. Consider connecting with your coach to discuss strategies for building confidence in navigating services.',
        bodyEs: 'Sus respuestas sugieren que puede beneficiarse de apoyo adicional para abogar por su familia. Considere conectarse con su coach para discutir estrategias para desarrollar confianza al navegar servicios.',
        resourceUrl: null,
        isActive: true
      },
      {
        assessmentId: assessment.id,
        conditionType: 'score_between',
        conditionValue: { min: 68, max: 119 },
        recommendationType: 'content',
        priority: 2,
        titleEn: 'Growing Your Advocacy Skills',
        titleEs: 'Desarrollando Sus Habilidades de Defensa',
        bodyEn: 'You show good foundations in family empowerment. Continue building on your strengths by exploring our advocacy modules and connecting with other families.',
        bodyEs: 'Muestra buenas bases en el empoderamiento familiar. Continúe desarrollando sus fortalezas explorando nuestros módulos de defensa y conectándose con otras familias.',
        resourceUrl: null,
        isActive: true
      },
      {
        assessmentId: assessment.id,
        conditionType: 'score_above',
        conditionValue: { threshold: 119 },
        recommendationType: 'action',
        priority: 3,
        titleEn: 'Strong Family Empowerment',
        titleEs: 'Fuerte Empoderamiento Familiar',
        bodyEn: 'Your responses indicate strong family empowerment. Consider sharing your experiences with other families or taking on peer mentoring roles.',
        bodyEs: 'Sus respuestas indican un fuerte empoderamiento familiar. Considere compartir sus experiencias con otras familias o asumir roles de mentoría entre pares.',
        resourceUrl: null,
        isActive: true
      }
    ]);

    return NextResponse.json({ 
      success: true,
      message: 'Family Empowerment Scale assessment created successfully',
      assessmentId: assessment.id,
      questionCount: FES_QUESTIONS.length
    });
  } catch (error) {
    console.error('Error seeding FES assessment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
