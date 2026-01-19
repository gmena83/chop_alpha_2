'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { Database, Shield, Bell, Globe } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure system settings and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your staff account details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{session?.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{session?.user?.name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium capitalize">
                    {session?.user?.role?.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Language</p>
                  <p className="font-medium uppercase">
                    {session?.user?.localePreference}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle>Database</CardTitle>
                <CardDescription>Database connection and status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">PostgreSQL Database</p>
                <p className="text-sm text-gray-500">Connected via Drizzle ORM</p>
              </div>
              <span className="flex items-center gap-2 text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Connected
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>Localization</CardTitle>
                <CardDescription>Language and region settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">English (EN)</p>
                  <p className="text-sm text-gray-500">Primary language</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Spanish (ES)</p>
                  <p className="text-sm text-gray-500">Secondary language</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Active
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Platform version and environment</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Platform</p>
                <p className="font-medium">CHOP ETA Platform</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Framework</p>
                <p className="font-medium">Next.js 14</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Environment</p>
                <p className="font-medium">Development</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Database</p>
                <p className="font-medium">PostgreSQL + Drizzle</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
