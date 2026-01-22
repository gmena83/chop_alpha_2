export interface MetricData {
  value: number;
  unit: string;
  trend: number;
  trendLabel: string;
  sparklineData?: number[];
}

export interface DropoffData {
  moduleName: string;
  dropoffCount: number;
  dropoffPercentage: number;
}

export interface AnalyticsDashboardData {
  avgLessonCompletionTime: MetricData;
  quizPassRateFirstTry: MetricData;
  moduleDropoffPoints: DropoffData[];
  avgSessionsPerWeek: MetricData;
  coPilotRatio: MetricData & { parentSessions: number; studentSessions: number };
  churnWarning14d: MetricData;
  onboardingSuccess: MetricData;
  velocityToMilestone: MetricData;
  userSentimentNPS: MetricData;
}

export async function getAvgLessonCompletionTime(): Promise<MetricData> {
  return {
    value: 18.4,
    unit: 'min',
    trend: 12,
    trendLabel: '+12% from last week',
    sparklineData: [14, 15, 16, 18, 17, 19, 18.4],
  };
}

export async function getQuizPassRateFirstTry(): Promise<MetricData> {
  return {
    value: 72,
    unit: '%',
    trend: 5,
    trendLabel: '+5% from last week',
    sparklineData: [65, 68, 70, 69, 71, 73, 72],
  };
}

export async function getModuleDropoffPoints(): Promise<DropoffData[]> {
  return [
    { moduleName: 'Unprotected Left Turns', dropoffCount: 45, dropoffPercentage: 28 },
    { moduleName: 'Highway Merging', dropoffCount: 32, dropoffPercentage: 20 },
    { moduleName: 'Parallel Parking', dropoffCount: 28, dropoffPercentage: 17 },
    { moduleName: 'Night Driving', dropoffCount: 22, dropoffPercentage: 14 },
    { moduleName: 'Weather Conditions', dropoffCount: 18, dropoffPercentage: 11 },
    { moduleName: 'Other Modules', dropoffCount: 16, dropoffPercentage: 10 },
  ];
}

export async function getAvgSessionsPerWeek(): Promise<MetricData> {
  return {
    value: 3.2,
    unit: 'sessions',
    trend: -8,
    trendLabel: '-8% from last week',
    sparklineData: [3.5, 3.6, 3.4, 3.3, 3.1, 3.0, 3.2],
  };
}

export async function getCoPilotRatio(): Promise<MetricData & { parentSessions: number; studentSessions: number }> {
  return {
    value: 1.4,
    unit: 'ratio',
    trend: 3,
    trendLabel: '+3% from last week',
    parentSessions: 420,
    studentSessions: 300,
    sparklineData: [1.2, 1.3, 1.3, 1.4, 1.5, 1.4, 1.4],
  };
}

export async function getChurnWarning14d(): Promise<MetricData> {
  return {
    value: 23,
    unit: 'accounts',
    trend: -15,
    trendLabel: '-15% from last week',
    sparklineData: [35, 32, 28, 26, 25, 24, 23],
  };
}

export async function getOnboardingSuccess(): Promise<MetricData> {
  return {
    value: 84,
    unit: '%',
    trend: 2,
    trendLabel: '+2% from last week',
    sparklineData: [78, 80, 81, 82, 83, 84, 84],
  };
}

export async function getVelocityToMilestone(): Promise<MetricData> {
  return {
    value: 42,
    unit: 'days',
    trend: -5,
    trendLabel: '-5 days (faster)',
    sparklineData: [52, 50, 48, 46, 44, 43, 42],
  };
}

export async function getUserSentimentNPS(): Promise<MetricData> {
  return {
    value: 67,
    unit: 'NPS',
    trend: 8,
    trendLabel: '+8 from last month',
    sparklineData: [55, 58, 60, 62, 64, 65, 67],
  };
}

export async function getAllAnalytics(): Promise<AnalyticsDashboardData> {
  const [
    avgLessonCompletionTime,
    quizPassRateFirstTry,
    moduleDropoffPoints,
    avgSessionsPerWeek,
    coPilotRatio,
    churnWarning14d,
    onboardingSuccess,
    velocityToMilestone,
    userSentimentNPS,
  ] = await Promise.all([
    getAvgLessonCompletionTime(),
    getQuizPassRateFirstTry(),
    getModuleDropoffPoints(),
    getAvgSessionsPerWeek(),
    getCoPilotRatio(),
    getChurnWarning14d(),
    getOnboardingSuccess(),
    getVelocityToMilestone(),
    getUserSentimentNPS(),
  ]);

  return {
    avgLessonCompletionTime,
    quizPassRateFirstTry,
    moduleDropoffPoints,
    avgSessionsPerWeek,
    coPilotRatio,
    churnWarning14d,
    onboardingSuccess,
    velocityToMilestone,
    userSentimentNPS,
  };
}
