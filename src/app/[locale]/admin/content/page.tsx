'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Plus,
  Pencil,
  BookOpen,
  Video,
  CheckSquare,
  ClipboardCheck,
  Gamepad2,
  RefreshCw,
  GripVertical
} from 'lucide-react';

interface Step {
  id: string;
  moduleId: string;
  slug: string;
  stepType: string;
  orderIndex: number;
  titleEn: string;
  titleEs: string;
  bodyMdEn: string | null;
  bodyMdEs: string | null;
  videoUrlEn: string | null;
  videoUrlEs: string | null;
  checklistItemsEn: string[] | null;
  checklistItemsEs: string[] | null;
  isRequired: boolean;
  isActive: boolean;
}

interface Module {
  id: string;
  slug: string;
  phase: string;
  orderIndex: number;
  titleEn: string;
  titleEs: string;
  descriptionEn: string | null;
  descriptionEs: string | null;
  estimatedMinutes: number | null;
  isActive: boolean;
  steps: Step[];
}

const STEP_TYPES = [
  { value: 'content', icon: BookOpen, label: 'Reading' },
  { value: 'video', icon: Video, label: 'Video' },
  { value: 'checklist', icon: CheckSquare, label: 'Checklist' },
  { value: 'assessment', icon: ClipboardCheck, label: 'Assessment' },
  { value: 'interactive', icon: Gamepad2, label: 'Interactive' },
];

function getStepIcon(stepType: string) {
  const type = STEP_TYPES.find(t => t.value === stepType);
  const Icon = type?.icon || BookOpen;
  return <Icon className="h-4 w-4" />;
}

export default function ContentPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/modules?includeInactive=true&includeSteps=true');
      if (response.ok) {
        const data = await response.json();
        setModules(data.modules);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleUpdateModule = async () => {
    if (!editingModule) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/modules/${editingModule.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleEn: editingModule.titleEn,
          titleEs: editingModule.titleEs,
          descriptionEn: editingModule.descriptionEn,
          descriptionEs: editingModule.descriptionEs,
          estimatedMinutes: editingModule.estimatedMinutes,
          isActive: editingModule.isActive
        })
      });
      
      if (response.ok) {
        setIsModuleDialogOpen(false);
        setEditingModule(null);
        fetchModules();
      }
    } catch (error) {
      console.error('Error updating module:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStep = async () => {
    if (!editingStep) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/modules/${editingStep.moduleId}/steps/${editingStep.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleEn: editingStep.titleEn,
          titleEs: editingStep.titleEs,
          bodyMdEn: editingStep.bodyMdEn,
          bodyMdEs: editingStep.bodyMdEs,
          videoUrlEn: editingStep.videoUrlEn,
          videoUrlEs: editingStep.videoUrlEs,
          stepType: editingStep.stepType,
          isRequired: editingStep.isRequired,
          isActive: editingStep.isActive
        })
      });
      
      if (response.ok) {
        setIsStepDialogOpen(false);
        setEditingStep(null);
        fetchModules();
      }
    } catch (error) {
      console.error('Error updating step:', error);
    } finally {
      setSaving(false);
    }
  };

  const prePermitModules = modules.filter(m => m.phase === 'pre_permit');
  const learningToDriveModules = modules.filter(m => m.phase === 'learning_to_drive');

  const renderModuleCard = (mod: Module) => (
    <AccordionItem key={mod.id} value={mod.id} className="border rounded-lg mb-2">
      <AccordionTrigger className="px-4 hover:no-underline">
        <div className="flex items-center gap-3 flex-1 text-left">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{locale === 'es' ? mod.titleEs : mod.titleEn}</span>
              {!mod.isActive && <Badge variant="outline">{t('admin.inactive')}</Badge>}
            </div>
            <div className="text-sm text-muted-foreground">
              {mod.steps.length} {t('admin.steps')} · {mod.estimatedMinutes || 0} {t('modules.minutes')}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setEditingModule(mod);
              setIsModuleDialogOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-2 mt-2">
          {mod.steps.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              {t('admin.noSteps')}
            </div>
          ) : (
            mod.steps.map((step, index) => (
              <div 
                key={step.id} 
                className="flex items-center gap-3 p-3 rounded-md border bg-muted/30 hover:bg-muted/50"
              >
                <span className="text-sm text-muted-foreground w-6">{index + 1}</span>
                {getStepIcon(step.stepType)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {locale === 'es' ? step.titleEs : step.titleEn}
                    </span>
                    {!step.isActive && <Badge variant="outline" className="text-xs">{t('admin.inactive')}</Badge>}
                    {step.isRequired && <Badge variant="secondary" className="text-xs">{t('modules.required')}</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t(`modules.stepTypes.${step.stepType}` as any)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingStep(step);
                    setIsStepDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.contentTitle')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('admin.contentDescription')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('modules.title')}
              </CardTitle>
              <CardDescription className="mt-1">
                {modules.length} {t('admin.modules')}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={fetchModules}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <Tabs defaultValue="pre_permit">
              <TabsList className="mb-4">
                <TabsTrigger value="pre_permit">{t('modules.phase1')}</TabsTrigger>
                <TabsTrigger value="learning_to_drive">{t('modules.phase2')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pre_permit">
                {prePermitModules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('admin.noModules')}
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="space-y-2">
                    {prePermitModules.map(renderModuleCard)}
                  </Accordion>
                )}
              </TabsContent>
              
              <TabsContent value="learning_to_drive">
                {learningToDriveModules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('admin.noModules')}
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="space-y-2">
                    {learningToDriveModules.map(renderModuleCard)}
                  </Accordion>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('admin.editModule')}</DialogTitle>
            <DialogDescription>{editingModule?.slug}</DialogDescription>
          </DialogHeader>
          {editingModule && (
            <Tabs defaultValue="en" className="mt-4">
              <TabsList>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="es">Español</TabsTrigger>
              </TabsList>
              
              <TabsContent value="en" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="titleEn">{t('admin.title')}</Label>
                  <Input
                    id="titleEn"
                    value={editingModule.titleEn}
                    onChange={(e) => setEditingModule({ ...editingModule, titleEn: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">{t('admin.description')}</Label>
                  <Textarea
                    id="descriptionEn"
                    value={editingModule.descriptionEn || ''}
                    onChange={(e) => setEditingModule({ ...editingModule, descriptionEn: e.target.value })}
                    rows={3}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="es" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="titleEs">{t('admin.title')}</Label>
                  <Input
                    id="titleEs"
                    value={editingModule.titleEs}
                    onChange={(e) => setEditingModule({ ...editingModule, titleEs: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionEs">{t('admin.description')}</Label>
                  <Textarea
                    id="descriptionEs"
                    value={editingModule.descriptionEs || ''}
                    onChange={(e) => setEditingModule({ ...editingModule, descriptionEs: e.target.value })}
                    rows={3}
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}
          {editingModule && (
            <div className="space-y-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="estimatedMinutes">{t('admin.estimatedMinutes')}</Label>
                  <Input
                    id="estimatedMinutes"
                    type="number"
                    value={editingModule.estimatedMinutes || ''}
                    onChange={(e) => setEditingModule({ ...editingModule, estimatedMinutes: parseInt(e.target.value) || null })}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    id="isActive"
                    checked={editingModule.isActive}
                    onCheckedChange={(checked) => setEditingModule({ ...editingModule, isActive: checked })}
                  />
                  <Label htmlFor="isActive">{t('admin.active')}</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModuleDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleUpdateModule} disabled={saving}>
              {saving ? t('common.loading') : t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isStepDialogOpen} onOpenChange={setIsStepDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.editStep')}</DialogTitle>
            <DialogDescription>{editingStep?.slug}</DialogDescription>
          </DialogHeader>
          {editingStep && (
            <>
              <div className="flex gap-4 mt-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="stepType">{t('admin.stepType')}</Label>
                  <Select 
                    value={editingStep.stepType} 
                    onValueChange={(value) => setEditingStep({ ...editingStep, stepType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STEP_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isRequired"
                      checked={editingStep.isRequired}
                      onCheckedChange={(checked) => setEditingStep({ ...editingStep, isRequired: checked })}
                    />
                    <Label htmlFor="isRequired">{t('modules.required')}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="stepIsActive"
                      checked={editingStep.isActive}
                      onCheckedChange={(checked) => setEditingStep({ ...editingStep, isActive: checked })}
                    />
                    <Label htmlFor="stepIsActive">{t('admin.active')}</Label>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="en" className="mt-4">
                <TabsList>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="es">Español</TabsTrigger>
                </TabsList>
                
                <TabsContent value="en" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="stepTitleEn">{t('admin.title')}</Label>
                    <Input
                      id="stepTitleEn"
                      value={editingStep.titleEn}
                      onChange={(e) => setEditingStep({ ...editingStep, titleEn: e.target.value })}
                    />
                  </div>
                  {(editingStep.stepType === 'content' || editingStep.stepType === 'interactive') && (
                    <div className="space-y-2">
                      <Label htmlFor="bodyMdEn">{t('admin.content')}</Label>
                      <Textarea
                        id="bodyMdEn"
                        value={editingStep.bodyMdEn || ''}
                        onChange={(e) => setEditingStep({ ...editingStep, bodyMdEn: e.target.value })}
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>
                  )}
                  {editingStep.stepType === 'video' && (
                    <div className="space-y-2">
                      <Label htmlFor="videoUrlEn">{t('admin.videoUrl')}</Label>
                      <Input
                        id="videoUrlEn"
                        value={editingStep.videoUrlEn || ''}
                        onChange={(e) => setEditingStep({ ...editingStep, videoUrlEn: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="es" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="stepTitleEs">{t('admin.title')}</Label>
                    <Input
                      id="stepTitleEs"
                      value={editingStep.titleEs}
                      onChange={(e) => setEditingStep({ ...editingStep, titleEs: e.target.value })}
                    />
                  </div>
                  {(editingStep.stepType === 'content' || editingStep.stepType === 'interactive') && (
                    <div className="space-y-2">
                      <Label htmlFor="bodyMdEs">{t('admin.content')}</Label>
                      <Textarea
                        id="bodyMdEs"
                        value={editingStep.bodyMdEs || ''}
                        onChange={(e) => setEditingStep({ ...editingStep, bodyMdEs: e.target.value })}
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>
                  )}
                  {editingStep.stepType === 'video' && (
                    <div className="space-y-2">
                      <Label htmlFor="videoUrlEs">{t('admin.videoUrl')}</Label>
                      <Input
                        id="videoUrlEs"
                        value={editingStep.videoUrlEs || ''}
                        onChange={(e) => setEditingStep({ ...editingStep, videoUrlEs: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStepDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleUpdateStep} disabled={saving}>
              {saving ? t('common.loading') : t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
