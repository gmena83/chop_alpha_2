'use client';

import { useState, use } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Video, FileText, CheckSquare } from 'lucide-react';

const STEP_TYPES = [
  { value: 'content', label: 'Content', icon: FileText, description: 'Text-based learning content' },
  { value: 'video', label: 'Video', icon: Video, description: 'Video lesson with optional transcript' },
  { value: 'checklist', label: 'Checklist', icon: CheckSquare, description: 'Interactive checklist items' },
];

export default function NewStepPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload: any = {
        slug: formData.slug,
        stepType: formData.stepType,
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

      const res = await fetch(`/api/admin/modules/${moduleId}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push(`/${locale}/staff/modules/${moduleId}`);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to create step');
      }
    } catch (err) {
      setError('An error occurred while creating the step');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 100);
  };

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

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Step</h1>
        <p className="text-gray-600 mt-1">
          Create a new learning step for this module
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Step Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STEP_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, stepType: type.value })
                  }
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    formData.stepType === type.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <type.icon
                    className={`h-6 w-6 mb-2 ${
                      formData.stepType === type.value
                        ? 'text-primary'
                        : 'text-gray-400'
                    }`}
                  />
                  <p className="font-medium">{type.label}</p>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

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
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      titleEn: e.target.value,
                      slug: formData.slug || generateSlug(e.target.value),
                    });
                  }}
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

        {formData.stepType === 'video' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Video Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="videoUrlEn">Video URL (English)</Label>
                  <Input
                    id="videoUrlEn"
                    type="url"
                    value={formData.videoUrlEn}
                    onChange={(e) =>
                      setFormData({ ...formData, videoUrlEn: e.target.value })
                    }
                    placeholder="https://youtube.com/embed/..."
                  />
                  <p className="text-xs text-gray-500">
                    Supports YouTube, Vimeo embed URLs
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoUrlEs">Video URL (Spanish)</Label>
                  <Input
                    id="videoUrlEs"
                    type="url"
                    value={formData.videoUrlEs}
                    onChange={(e) =>
                      setFormData({ ...formData, videoUrlEs: e.target.value })
                    }
                    placeholder="https://youtube.com/embed/..."
                  />
                </div>
              </div>

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
                    placeholder="Optional video transcript or notes..."
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
                    placeholder="Optional video transcript or notes..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {formData.stepType === 'content' && (
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
                    rows={10}
                    placeholder="Write your content in Markdown format..."
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
                    rows={10}
                    placeholder="Write your content in Markdown format..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {formData.stepType === 'checklist' && (
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
                    placeholder="Check mirrors before backing up&#10;Signal before changing lanes&#10;Maintain safe following distance"
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
                    placeholder="Revisar los espejos antes de retroceder&#10;Señalar antes de cambiar de carril&#10;Mantener distancia segura"
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

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${locale}/staff/modules/${moduleId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Create Step
          </Button>
        </div>
      </form>
    </div>
  );
}
