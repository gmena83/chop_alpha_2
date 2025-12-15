'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Car, 
  Clock, 
  Calendar,
  Plus,
  Trophy,
  Sun,
  Moon,
  CloudRain,
  Route,
  ParkingCircle,
  CheckCircle2
} from 'lucide-react';

interface PermitData {
  id: string;
  status: string;
  practiceHoursRequired: number | null;
  practiceHoursCompleted: number;
  nightHoursRequired: number | null;
  nightHoursCompleted: number;
  permitObtainedDate: string | null;
  permitExpiryDate: string | null;
}

interface PracticeLog {
  id: string;
  practiceDate: string;
  practiceType: string;
  durationMinutes: number;
  distanceMiles: number | null;
  routeDescription: string | null;
  successesNoted: string | null;
}

const STATUS_STEPS = [
  'not_started',
  'studying',
  'ready_for_test',
  'test_scheduled',
  'test_passed',
  'permit_obtained',
  'practicing',
  'license_test_scheduled',
  'license_obtained'
];

export default function PermitPage() {
  const t = useTranslations();
  const { data: session } = useSession();
  const [permitData, setPermitData] = useState<PermitData | null>(null);
  const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [newLog, setNewLog] = useState({
    practiceDate: new Date().toISOString().split('T')[0],
    practiceType: 'daytime',
    durationMinutes: 60,
    distanceMiles: 0,
    routeDescription: '',
    successesNoted: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [permitRes, logsRes] = await Promise.all([
        fetch('/api/permit'),
        fetch('/api/permit/logs')
      ]);
      
      if (permitRes.ok) {
        const data = await permitRes.json();
        setPermitData(data.permit);
      }
      
      if (logsRes.ok) {
        const data = await logsRes.json();
        setPracticeLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch permit data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPracticeLog = async () => {
    setIsAddingLog(true);
    try {
      const res = await fetch('/api/permit/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      });
      
      if (res.ok) {
        await fetchData();
        setDialogOpen(false);
        setNewLog({
          practiceDate: new Date().toISOString().split('T')[0],
          practiceType: 'daytime',
          durationMinutes: 60,
          distanceMiles: 0,
          routeDescription: '',
          successesNoted: ''
        });
      }
    } catch (error) {
      console.error('Failed to add practice log:', error);
    } finally {
      setIsAddingLog(false);
    }
  };

  const getStatusIndex = (status: string) => {
    return STATUS_STEPS.indexOf(status);
  };

  const getProgressPercentage = () => {
    if (!permitData) return 0;
    const index = getStatusIndex(permitData.status);
    return Math.round(((index + 1) / STATUS_STEPS.length) * 100);
  };

  const getPracticeProgress = () => {
    if (!permitData || !permitData.practiceHoursRequired) return 0;
    return Math.min(100, Math.round((permitData.practiceHoursCompleted / permitData.practiceHoursRequired) * 100));
  };

  const getNightProgress = () => {
    if (!permitData || !permitData.nightHoursRequired) return 0;
    return Math.min(100, Math.round((permitData.nightHoursCompleted / permitData.nightHoursRequired) * 100));
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      daytime: <Sun className="h-4 w-4" />,
      nighttime: <Moon className="h-4 w-4" />,
      highway: <Route className="h-4 w-4" />,
      parking: <ParkingCircle className="h-4 w-4" />,
      inclement_weather: <CloudRain className="h-4 w-4" />,
      other: <Car className="h-4 w-4" />
    };
    return icons[type] || icons.other;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[hsl(211,100%,20%)]">
          {t('permit.title')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('permit.subtitle')}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">{t('common.loading')}</div>
      ) : !permitData ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="h-16 w-16 rounded-full bg-[hsl(211,100%,20%,0.1)] flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-[hsl(211,100%,20%)]" />
            </div>
            <CardTitle>{t('permit.getStarted')}</CardTitle>
            <CardDescription>{t('permit.getStartedDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={async () => {
                await fetch('/api/permit', { method: 'POST' });
                await fetchData();
              }}
              className="bg-[hsl(211,100%,20%)] hover:bg-[hsl(211,100%,25%)]"
            >
              {t('permit.startTracking')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-[hsl(32,100%,48%)]" />
                    {t('permit.journeyProgress')}
                  </CardTitle>
                  <CardDescription>{t('permit.journeyDescription')}</CardDescription>
                </div>
                <Badge variant="outline" className="text-[hsl(211,100%,20%)]">
                  {t(`permit.status.${permitData.status}`)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={getProgressPercentage()} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t('permit.status.not_started')}</span>
                  <span>{t('permit.status.license_obtained')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[hsl(145,100%,29%)]" />
                  {t('permit.practiceHours')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{t('permit.totalHours')}</span>
                    <span className="font-medium">
                      {permitData.practiceHoursCompleted} / {permitData.practiceHoursRequired || 50} {t('permit.hours')}
                    </span>
                  </div>
                  <Progress value={getPracticeProgress()} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{t('permit.nightHours')}</span>
                    <span className="font-medium">
                      {permitData.nightHoursCompleted} / {permitData.nightHoursRequired || 10} {t('permit.hours')}
                    </span>
                  </div>
                  <Progress value={getNightProgress()} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[hsl(211,100%,20%)]" />
                    {t('permit.recentPractice')}
                  </CardTitle>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-[hsl(145,100%,29%)] hover:bg-[hsl(145,100%,25%)]">
                        <Plus className="h-4 w-4 mr-1" />
                        {t('permit.logPractice')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('permit.addPracticeLog')}</DialogTitle>
                        <DialogDescription>{t('permit.addPracticeDescription')}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>{t('permit.date')}</Label>
                            <Input 
                              type="date" 
                              value={newLog.practiceDate}
                              onChange={(e) => setNewLog({ ...newLog, practiceDate: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>{t('permit.type')}</Label>
                            <Select 
                              value={newLog.practiceType}
                              onValueChange={(value) => setNewLog({ ...newLog, practiceType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daytime">{t('permit.types.daytime')}</SelectItem>
                                <SelectItem value="nighttime">{t('permit.types.nighttime')}</SelectItem>
                                <SelectItem value="highway">{t('permit.types.highway')}</SelectItem>
                                <SelectItem value="parking">{t('permit.types.parking')}</SelectItem>
                                <SelectItem value="inclement_weather">{t('permit.types.inclement_weather')}</SelectItem>
                                <SelectItem value="other">{t('permit.types.other')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>{t('permit.duration')}</Label>
                            <Input 
                              type="number" 
                              min="1"
                              value={newLog.durationMinutes}
                              onChange={(e) => setNewLog({ ...newLog, durationMinutes: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>{t('permit.distance')}</Label>
                            <Input 
                              type="number" 
                              min="0"
                              value={newLog.distanceMiles}
                              onChange={(e) => setNewLog({ ...newLog, distanceMiles: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('permit.route')}</Label>
                          <Input 
                            placeholder={t('permit.routePlaceholder')}
                            value={newLog.routeDescription}
                            onChange={(e) => setNewLog({ ...newLog, routeDescription: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('permit.successes')}</Label>
                          <Textarea 
                            placeholder={t('permit.successesPlaceholder')}
                            value={newLog.successesNoted}
                            onChange={(e) => setNewLog({ ...newLog, successesNoted: e.target.value })}
                          />
                        </div>
                        <Button 
                          onClick={addPracticeLog}
                          disabled={isAddingLog}
                          className="w-full bg-[hsl(211,100%,20%)] hover:bg-[hsl(211,100%,25%)]"
                        >
                          {isAddingLog ? t('common.loading') : t('common.save')}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {practiceLogs.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Car className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{t('permit.noLogs')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {practiceLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[hsl(211,100%,20%,0.1)] flex items-center justify-center">
                            {getTypeIcon(log.practiceType)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{formatDate(log.practiceDate)}</p>
                            <p className="text-xs text-muted-foreground">
                              {t(`permit.types.${log.practiceType}`)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{log.durationMinutes} min</p>
                          {log.distanceMiles && (
                            <p className="text-xs text-muted-foreground">{log.distanceMiles} mi</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
