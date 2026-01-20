'use client';

import { useEffect, useState, use } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { VideoUploader } from '@/components/upload/VideoUploader';

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

export default function EditStepPage({
  params,
}: {
  params: Promise<{ moduleId: string; stepId: string }>;
}) {
  const { moduleId, stepId } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<Step | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    stepType: 'content',
    orderIndex: 0,
    titleEn: '',
    titleEs: '',
    bodyMdEn: '',
    bodyMdEs: '',
    videoUrlEn: '',
    videoUrlEs: '',
    checklistItemsEn: '',
    checklistItemsEs: '',
    isRequired: true,
    isActive: true,
  });

  useEffect(() => {
    fetchStep();
  }, [stepId]);

  async function fetchStep() {
    try {
      const res = await fetch(
        `/api/admin/modules/${moduleId}/steps/${stepId}`
      );
      if (res.ok) {
        const data = await res.json();
        setStep(data.step);
        setFormData({
          slug: data.step.slug,
          stepType: data.step.stepType,
          orderIndex: data.step.orderIndex,
          titleEn: data.step.titleEn,
          titleEs: data.step.titleEs,
          bodyMdEn: data.step.bodyMdEn || '',
          bodyMdEs: data.step.bodyMdEs || '',
          videoUrlEn: data.step.videoUrlEn || '',
          videoUrlEs: data.step.videoUrlEs || '',
          checklistItemsEn: data.step.checklistItemsEn?.join('\n') || '',
          checklistItemsEs: data.step.checklistItemsEs?.join('\n') || '',
          isRequired: data.step.isRequired,
          isActive: data.step.isActive,
        });
      } else {
        setError('Step not found');
      }
    } catch (err) {
      setError('Failed to load step');
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
      const payload: any = {
        slug: formData.slug,
        orderIndex: formData.orderIndex,
        titleEn: formData.titleEn,
        titleEs: formData.titleEs,
        isRequired: formData.isRequired,
        isActive: formData.isActive,
      };

      if (formData.stepType === 'content') {
        payload.bodyMdEn = formData.bodyMdEn;
        payload.bodyMdEs = formData.bodyMdEs;
      } else if (formData.stepType === 'video') {
        payload.videoUrlEn = formData.videoUrlEn;
        payload.videoUrlEs = formData.videoUrlEs;
        payload.bodyMdEn = formData.bodyMdEn;
        payload.bodyMdEs = formData.bodyMdEs;
      } else if (formData.stepType === 'checklist') {
        payload.checklistItemsEn = formData.checklistItemsEn
          .split('\n')
          .filter((item) => item.trim());
        payload.checklistItemsEs = formData.checklistItemsEs
          .split('\n')
          .filter((item) => item.trim());
      }

      const res = await fetch(
        `/api/admin/modules/${moduleId}/steps/${stepId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setSuccess('Step updated successfully');
        fetchStep();
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to update step');
      }
    } catch (err) {
      setError('An error occurred while updating the step');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this step? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      const res = await fetch(
        `/api/admin/modules/${moduleId}/steps/${stepId}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        router.push(`/${locale}/staff/modules/${moduleId}`);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to delete step');
      }
    } catch (err) {
      setError('An error occurred while deleting the step');
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

  if (!step) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Step Not Found</h2>
        <Button
          className="mt-4"
          onClick={() => router.push(`/${locale}/staff/modules/${moduleId}`)}
        >
          Back to Module
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push(`/${locale}/staff/modules/${moduleId}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Module
      </Button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Step</h1>
          <p className="text-gray-600 mt-1">Update step content and settings</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {step.stepType}
        </Badge>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </CardContent>
        </Card>

        {step.stepType === 'video' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Video Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">English Video</Label>
                  <VideoUploader
                    value={formData.videoUrlEn}
                    onChange={(url) => setFormData({ ...formData, videoUrlEn: url })}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="videoUrlEn">Or paste video URL</Label>
                    <Input
                      id="videoUrlEn"
                      value={formData.videoUrlEn}
                      onChange={(e) =>
                        setFormData({ ...formData, videoUrlEn: e.target.value })
                      }
                      placeholder="https://youtube.com/embed/... or uploaded video path"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Spanish Video</Label>
                  <VideoUploader
                    value={formData.videoUrlEs}
                    onChange={(url) => setFormData({ ...formData, videoUrlEs: url })}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="videoUrlEs">Or paste video URL</Label>
                    <Input
                      id="videoUrlEs"
                      value={formData.videoUrlEs}
                      onChange={(e) =>
                        setFormData({ ...formData, videoUrlEs: e.target.value })
                      }
                      placeholder="https://youtube.com/embed/... or uploaded video path"
                    />
                  </div>
                </div>
              </div>

              {formData.videoUrlEn && !formData.videoUrlEn.startsWith('/api/uploads') && (
                <div className="mt-4">
                  <Label>External Video Preview (English)</Label>
                  <div className="mt-2 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={formData.videoUrlEn}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="transcriptEn">Transcript/Notes (English)</Label>
                  <Textarea
                    id="transcriptEn"
                    value={formData.bodyMdEn}
                    onChange={(e) =>
                      setFormData({ ...formData, bodyMdEn: e.target.value })
                    }
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transcriptEs">Transcript/Notes (Spanish)</Label>
                  <Textarea
                    id="transcriptEs"
                    value={formData.bodyMdEs}
                    onChange={(e) =>
                      setFormData({ ...formData, bodyMdEs: e.target.value })
                    }
                    rows={6}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step.stepType === 'content' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bodyMdEn">Content (English) - Markdown</Label>
                  <Textarea
                    id="bodyMdEn"
                    value={formData.bodyMdEn}
                    onChange={(e) =>
                      setFormData({ ...formData, bodyMdEn: e.target.value })
                    }
                    rows={12}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyMdEs">Content (Spanish) - Markdown</Label>
                  <Textarea
                    id="bodyMdEs"
                    value={formData.bodyMdEs}
                    onChange={(e) =>
                      setFormData({ ...formData, bodyMdEs: e.target.value })
                    }
                    rows={12}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step.stepType === 'checklist' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Checklist Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-gray-500">
                Enter each checklist item on a new line
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="checklistEn">Items (English)</Label>
                  <Textarea
                    id="checklistEn"
                    value={formData.checklistItemsEn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        checklistItemsEn: e.target.value,
                      })
                    }
                    rows={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checklistEs">Items (Spanish)</Label>
                  <Textarea
                    id="checklistEs"
                    value={formData.checklistItemsEs}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        checklistItemsEs: e.target.value,
                      })
                    }
                    rows={8}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isRequired"
                checked={formData.isRequired}
                onChange={(e) =>
                  setFormData({ ...formData, isRequired: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isRequired" className="cursor-pointer">
                This step is required to complete the module
              </Label>
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
                Step is active and visible to users
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
            Delete Step
          </Button>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${locale}/staff/modules/${moduleId}`)}
            >
              Cancel
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
        </div>
      </form>
    </div>
  );
}
