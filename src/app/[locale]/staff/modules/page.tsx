'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Pencil,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Search,
} from 'lucide-react';

interface Step {
  id: string;
  slug: string;
  stepType: string;
  orderIndex: number;
  titleEn: string;
  titleEs: string;
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
  steps?: Step[];
}

export default function ModulesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [showInactive, setShowInactive] = useState(true);

  useEffect(() => {
    fetchModules();
  }, [showInactive]);

  async function fetchModules() {
    try {
      const res = await fetch(
        `/api/admin/modules?includeInactive=${showInactive}&includeSteps=true`
      );
      if (res.ok) {
        const data = await res.json();
        setModules(data.modules || []);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleModuleExpand = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const toggleModuleActive = async (moduleId: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/modules/${moduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId ? { ...m, isActive: !isActive } : m
          )
        );
      }
    } catch (error) {
      console.error('Error toggling module:', error);
    }
  };

  const filteredModules = modules.filter(
    (m) =>
      m.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const phaseGroups = {
    pre_permit: filteredModules.filter((m) => m.phase === 'pre_permit'),
    learning_to_drive: filteredModules.filter(
      (m) => m.phase === 'learning_to_drive'
    ),
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modules</h1>
          <p className="text-gray-600 mt-1">
            Manage learning modules and their content
          </p>
        </div>
        <Button onClick={() => router.push(`/${locale}/staff/modules/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Module
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowInactive(!showInactive)}
            >
              {showInactive ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Inactive
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Inactive
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {Object.entries(phaseGroups).map(([phase, phaseModules]) => (
            <Card key={phase} className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge
                    variant={
                      phase === 'pre_permit' ? 'secondary' : 'default'
                    }
                  >
                    {phase === 'pre_permit'
                      ? 'Pre-Permit Phase'
                      : 'Learning to Drive Phase'}
                  </Badge>
                  <span className="text-sm font-normal text-gray-500">
                    ({phaseModules.length} modules)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {phaseModules.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No modules in this phase
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8"></TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Steps</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {phaseModules.map((module) => (
                        <React.Fragment key={module.id}>
                          <TableRow>
                            <TableCell>
                              <button
                                onClick={() => toggleModuleExpand(module.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                {expandedModules.has(module.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            </TableCell>
                            <TableCell className="font-medium">
                              {module.titleEn}
                            </TableCell>
                            <TableCell className="text-gray-500">
                              {module.slug}
                            </TableCell>
                            <TableCell>{module.orderIndex}</TableCell>
                            <TableCell>
                              {module.steps?.length || 0} steps
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  module.isActive ? 'success' : 'secondary'
                                }
                              >
                                {module.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    toggleModuleActive(
                                      module.id,
                                      module.isActive
                                    )
                                  }
                                >
                                  {module.isActive ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    router.push(
                                      `/${locale}/staff/modules/${module.id}`
                                    )
                                  }
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedModules.has(module.id) &&
                            module.steps &&
                            module.steps.length > 0 && (
                              <TableRow>
                                <TableCell colSpan={7} className="bg-gray-50">
                                  <div className="pl-8 py-2">
                                    <p className="text-sm font-medium text-gray-600 mb-2">
                                      Steps:
                                    </p>
                                    <div className="space-y-2">
                                      {module.steps.map((step) => (
                                        <div
                                          key={step.id}
                                          className="flex items-center justify-between bg-white p-3 rounded-lg border"
                                        >
                                          <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-400">
                                              #{step.orderIndex}
                                            </span>
                                            <span className="font-medium">
                                              {step.titleEn}
                                            </span>
                                            <Badge variant="outline">
                                              {step.stepType}
                                            </Badge>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              router.push(
                                                `/${locale}/staff/modules/${module.id}/steps/${step.id}`
                                              )
                                            }
                                          >
                                            <Pencil className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="mt-3"
                                      onClick={() =>
                                        router.push(
                                          `/${locale}/staff/modules/${module.id}/steps/new`
                                        )
                                      }
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Step
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
