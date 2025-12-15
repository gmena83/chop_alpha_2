'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  FlaskConical, 
  Plus,
  Users,
  Shuffle,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3
} from 'lucide-react';

interface Study {
  id: string;
  slug: string;
  titleEn: string;
  titleEs: string;
  status: string;
  targetEnrollment: number | null;
  currentEnrollment: number;
  principalInvestigator: string | null;
  irbNumber: string | null;
}

interface StudyArm {
  id: string;
  nameEn: string;
  nameEs: string;
  allocationWeight: number;
  currentParticipants: number;
  isControl: boolean;
}

interface Enrollment {
  id: string;
  participantId: string | null;
  status: string;
  armName: string | null;
  randomizedAt: string | null;
}

export default function StudiesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [studies, setStudies] = useState<Study[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [arms, setArms] = useState<StudyArm[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newStudy, setNewStudy] = useState({
    slug: '',
    titleEn: '',
    titleEs: '',
    principalInvestigator: '',
    irbNumber: '',
    targetEnrollment: 100
  });

  useEffect(() => {
    fetchStudies();
  }, []);

  useEffect(() => {
    if (selectedStudy) {
      fetchStudyDetails(selectedStudy.id);
    }
  }, [selectedStudy]);

  const fetchStudies = async () => {
    try {
      const res = await fetch('/api/admin/studies');
      if (res.ok) {
        const data = await res.json();
        setStudies(data.studies || []);
      }
    } catch (error) {
      console.error('Failed to fetch studies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudyDetails = async (studyId: string) => {
    try {
      const [armsRes, enrollmentsRes] = await Promise.all([
        fetch(`/api/admin/studies/${studyId}/arms`),
        fetch(`/api/admin/studies/${studyId}/enrollments`)
      ]);
      
      if (armsRes.ok) {
        const data = await armsRes.json();
        setArms(data.arms || []);
      }
      
      if (enrollmentsRes.ok) {
        const data = await enrollmentsRes.json();
        setEnrollments(data.enrollments || []);
      }
    } catch (error) {
      console.error('Failed to fetch study details:', error);
    }
  };

  const createStudy = async () => {
    try {
      const res = await fetch('/api/admin/studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudy)
      });
      
      if (res.ok) {
        await fetchStudies();
        setCreateDialogOpen(false);
        setNewStudy({
          slug: '',
          titleEn: '',
          titleEs: '',
          principalInvestigator: '',
          irbNumber: '',
          targetEnrollment: 100
        });
      }
    } catch (error) {
      console.error('Failed to create study:', error);
    }
  };

  const randomizeParticipant = async (enrollmentId: string) => {
    if (!selectedStudy) return;
    
    try {
      const res = await fetch(`/api/admin/studies/${selectedStudy.id}/randomize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId })
      });
      
      if (res.ok) {
        await fetchStudyDetails(selectedStudy.id);
      }
    } catch (error) {
      console.error('Failed to randomize:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
      draft: { variant: 'outline', icon: <Clock className="h-3 w-3" /> },
      active: { variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
      paused: { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
      completed: { variant: 'outline', icon: <CheckCircle2 className="h-3 w-3" /> },
      archived: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> }
    };
    const c = config[status] || config.draft;
    return (
      <Badge variant={c.variant} className="flex items-center gap-1">
        {c.icon}
        {t(`admin.studyStatus.${status}`)}
      </Badge>
    );
  };

  const getTitle = (study: Study) => locale === 'es' ? study.titleEs : study.titleEn;
  const getArmName = (arm: StudyArm) => locale === 'es' ? arm.nameEs : arm.nameEn;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.studiesTitle')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('admin.studiesDescription')}
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[hsl(211,100%,20%)] hover:bg-[hsl(211,100%,25%)]">
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.createStudy')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.createStudy')}</DialogTitle>
              <DialogDescription>{t('admin.createStudyDescription')}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t('admin.studySlug')}</Label>
                <Input 
                  value={newStudy.slug}
                  onChange={(e) => setNewStudy({ ...newStudy, slug: e.target.value })}
                  placeholder="eta-study-2024"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.titleEnglish')}</Label>
                  <Input 
                    value={newStudy.titleEn}
                    onChange={(e) => setNewStudy({ ...newStudy, titleEn: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.titleSpanish')}</Label>
                  <Input 
                    value={newStudy.titleEs}
                    onChange={(e) => setNewStudy({ ...newStudy, titleEs: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.principalInvestigator')}</Label>
                  <Input 
                    value={newStudy.principalInvestigator}
                    onChange={(e) => setNewStudy({ ...newStudy, principalInvestigator: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.irbNumber')}</Label>
                  <Input 
                    value={newStudy.irbNumber}
                    onChange={(e) => setNewStudy({ ...newStudy, irbNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('admin.targetEnrollment')}</Label>
                <Input 
                  type="number"
                  value={newStudy.targetEnrollment}
                  onChange={(e) => setNewStudy({ ...newStudy, targetEnrollment: parseInt(e.target.value) || 0 })}
                />
              </div>
              <Button onClick={createStudy} className="w-full">
                {t('admin.createStudy')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">{t('common.loading')}</div>
      ) : studies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FlaskConical className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">{t('admin.noStudies')}</h3>
            <p className="text-muted-foreground mt-2">{t('admin.createFirstStudy')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-semibold text-lg">{t('admin.allStudies')}</h2>
            {studies.map((study) => (
              <Card 
                key={study.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${selectedStudy?.id === study.id ? 'border-primary' : ''}`}
                onClick={() => setSelectedStudy(study)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{getTitle(study)}</CardTitle>
                    {getStatusBadge(study.status)}
                  </div>
                  <CardDescription>{study.slug}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {study.currentEnrollment}/{study.targetEnrollment || '--'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedStudy ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{getTitle(selectedStudy)}</CardTitle>
                      <CardDescription>
                        {selectedStudy.principalInvestigator && `PI: ${selectedStudy.principalInvestigator}`}
                        {selectedStudy.irbNumber && ` | IRB: ${selectedStudy.irbNumber}`}
                      </CardDescription>
                    </div>
                    {getStatusBadge(selectedStudy.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="arms">
                    <TabsList>
                      <TabsTrigger value="arms" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        {t('admin.studyArms')}
                      </TabsTrigger>
                      <TabsTrigger value="enrollments" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {t('admin.enrollments')}
                      </TabsTrigger>
                      <TabsTrigger value="randomize" className="flex items-center gap-2">
                        <Shuffle className="h-4 w-4" />
                        {t('admin.randomization')}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="arms" className="mt-4">
                      {arms.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          {t('admin.noArms')}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {arms.map((arm) => (
                            <div key={arm.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{getArmName(arm)}</span>
                                  {arm.isControl && (
                                    <Badge variant="outline">{t('admin.control')}</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {t('admin.weight')}: {arm.allocationWeight}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{arm.currentParticipants}</p>
                                <p className="text-sm text-muted-foreground">{t('admin.participants')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="enrollments" className="mt-4">
                      {enrollments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          {t('admin.noEnrollments')}
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t('admin.participantId')}</TableHead>
                              <TableHead>{t('admin.status')}</TableHead>
                              <TableHead>{t('admin.arm')}</TableHead>
                              <TableHead>{t('admin.randomizedAt')}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {enrollments.map((enrollment) => (
                              <TableRow key={enrollment.id}>
                                <TableCell>{enrollment.participantId || '--'}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{enrollment.status}</Badge>
                                </TableCell>
                                <TableCell>{enrollment.armName || '--'}</TableCell>
                                <TableCell>
                                  {enrollment.randomizedAt 
                                    ? new Date(enrollment.randomizedAt).toLocaleDateString()
                                    : '--'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </TabsContent>

                    <TabsContent value="randomize" className="mt-4">
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-2">{t('admin.randomizationInfo')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('admin.randomizationDescription')}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">{t('admin.pendingRandomization')}</h4>
                          {enrollments.filter(e => e.status === 'consented' && !e.armName).length === 0 ? (
                            <p className="text-sm text-muted-foreground">{t('admin.noPendingRandomization')}</p>
                          ) : (
                            enrollments
                              .filter(e => e.status === 'consented' && !e.armName)
                              .map((enrollment) => (
                                <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <span>{enrollment.participantId || t('admin.unassigned')}</span>
                                  <Button 
                                    size="sm"
                                    onClick={() => randomizeParticipant(enrollment.id)}
                                    className="bg-[hsl(145,100%,29%)] hover:bg-[hsl(145,100%,25%)]"
                                  >
                                    <Shuffle className="h-4 w-4 mr-1" />
                                    {t('admin.randomize')}
                                  </Button>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">{t('admin.selectStudy')}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
