'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewModulePage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/${locale}/staff/modules/${data.module.id}`);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to create module');
      }
    } catch (err) {
      setError('An error occurred while creating the module');
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
        onClick={() => router.push(`/${locale}/staff/modules`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Modules
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Module</h1>
        <p className="text-gray-600 mt-1">
          Add a new learning module to the platform
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

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="module-slug"
                required
              />
              <p className="text-sm text-gray-500">
                URL-friendly identifier for the module
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="descriptionEn">Description (English)</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) =>
                    setFormData({ ...formData, descriptionEn: e.target.value })
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
                    setFormData({ ...formData, descriptionEs: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phase">Phase *</Label>
                <select
                  id="phase"
                  value={formData.phase}
                  onChange={(e) =>
                    setFormData({ ...formData, phase: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                <Label htmlFor="estimatedMinutes">Estimated Minutes</Label>
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

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${locale}/staff/modules`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Create Module
          </Button>
        </div>
      </form>
    </div>
  );
}
