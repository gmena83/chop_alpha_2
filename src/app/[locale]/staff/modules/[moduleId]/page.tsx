'use client';

import { useEffect, useState, use } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';

interface Step {
  id: string;
  slug: string;
  stepType: string;
  orderIndex: number;
  titleEn: string;
  titleEs: string;
  isActive: boolean;
  videoUrlEn?: string;
  videoUrlEs?: string;
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
  steps?: Step[];
}

export default function EditModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [module, setModule] = useState<Module | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    phase: 'pre_permit',
    orderIndex: 0,
    titleEn: '',
    titleEs: '',
    descriptionEn: '',
    descriptionEs: '',
    estimatedMinutes: 30,
    isActive: true,
  });

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  async function fetchModule() {
    try {
      const res = await fetch(`/api/admin/modules/${moduleId}`);
      if (res.ok) {
        const data = await res.json();
        setModule(data.module);
        setFormData({
          slug: data.module.slug,
          phase: data.module.phase,
          orderIndex: data.module.orderIndex,
          titleEn: data.module.titleEn,
          titleEs: data.module.titleEs,
          descriptionEn: data.module.descriptionEn || '',
          descriptionEs: data.module.descriptionEs || '',
          estimatedMinutes: data.module.estimatedMinutes || 30,
          isActive: data.module.isActive,
        });
      } else {
        setError('Module not found');
      }
    } catch (err) {
      setError('Failed to load module');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/modules/${moduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess('Module updated successfully');
        fetchModule();
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to update module');
      }
    } catch (err) {
      setError('An error occurred while updating the module');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this module and all its steps? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/modules/${moduleId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push(`/${locale}/staff/modules`);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to delete module');
      }
    } catch (err) {
      setError('An error occurred while deleting the module');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Module Not Found</h2>
        <Button
          className="mt-4"
          onClick={() => router.push(`/${locale}/staff/modules`)}
        >
          Back to Modules
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push(`/${locale}/staff/modules`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Modules
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Module</h1>
        <p className="text-gray-600 mt-1">Update module details and content</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="titleEn">Title (English) *</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) =>
                        setFormData({ ...formData, titleEn: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="titleEs">Title (Spanish) *</Label>
                    <Input
                      id="titleEs"
                      value={formData.titleEs}
                      onChange={(e) =>
                        setFormData({ ...formData, titleEs: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="descriptionEn">Description (English)</Label>
                    <Textarea
                      id="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionEn: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descriptionEs">Description (Spanish)</Label>
                    <Textarea
                      id="descriptionEs"
                      value={formData.descriptionEs}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionEs: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phase">Phase *</Label>
                    <select
                      id="phase"
                      value={formData.phase}
                      onChange={(e) =>
                        setFormData({ ...formData, phase: e.target.value })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="pre_permit">Pre-Permit</option>
                      <option value="learning_to_drive">Learning to Drive</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orderIndex">Order Index</Label>
                    <Input
                      id="orderIndex"
                      type="number"
                      value={formData.orderIndex}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          orderIndex: parseInt(e.target.value) || 0,
                        })
                      }
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedMinutes">Est. Minutes</Label>
                    <Input
                      id="estimatedMinutes"
                      type="number"
                      value={formData.estimatedMinutes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estimatedMinutes: parseInt(e.target.value) || 0,
                        })
                      }
                      min={0}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Module is active and visible to users
                  </Label>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete Module
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Steps</CardTitle>
              <Button
                size="sm"
                onClick={() =>
                  router.push(`/${locale}/staff/modules/${moduleId}/steps/new`)
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              {module.steps && module.steps.length > 0 ? (
                <div className="space-y-3">
                  {module.steps
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((step) => (
                      <div
                        key={step.id}
                        className="p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-400">
                                #{step.orderIndex}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {step.stepType}
                              </Badge>
                            </div>
                            <p className="font-medium text-sm">
                              {step.titleEn}
                            </p>
                            {step.videoUrlEn && (
                              <p className="text-xs text-blue-600 mt-1">
                                Has video content
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/${locale}/staff/modules/${moduleId}/steps/${step.id}`
                              )
                            }
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No steps added yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
