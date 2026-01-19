'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Search,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  localePreference: string;
  createdAt: string;
  emailVerified: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const ROLES = [
  { value: 'parent', label: 'Parent', color: 'bg-blue-100 text-blue-800' },
  { value: 'teen', label: 'Teen', color: 'bg-green-100 text-green-800' },
  { value: 'professional', label: 'Professional', color: 'bg-purple-100 text-purple-800' },
  { value: 'research_staff', label: 'Research Staff', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'admin', label: 'Admin', color: 'bg-orange-100 text-orange-800' },
  { value: 'super_admin', label: 'Super Admin', color: 'bg-red-100 text-red-800' },
];

export default function UsersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    name: '',
    password: '',
    role: 'parent',
    localePreference: 'en',
  });
  const [editUserForm, setEditUserForm] = useState({
    name: '',
    role: 'parent',
    localePreference: 'en',
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, searchQuery, roleFilter]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (searchQuery) params.append('search', searchQuery);
      if (roleFilter) params.append('role', roleFilter);

      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserForm),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewUserForm({
          email: '',
          name: '',
          password: '',
          role: 'parent',
          localePreference: 'en',
        });
        fetchUsers();
      } else {
        const data = await res.json();
        setFormError(data.error || 'Failed to create user');
      }
    } catch (error) {
      setFormError('An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setFormLoading(true);
    setFormError('');

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUserForm),
      });

      if (res.ok) {
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        setFormError(data.error || 'Failed to update user');
      }
    } catch (error) {
      setFormError('An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditUserForm({
      name: user.name || '',
      role: user.role,
      localePreference: user.localePreference,
    });
    setShowEditModal(true);
  };

  const getRoleBadge = (role: string) => {
    const roleInfo = ROLES.find((r) => r.value === role);
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          roleInfo?.color || 'bg-gray-100 text-gray-800'
        }`}
      >
        {roleInfo?.label || role}
      </span>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and roles</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Roles</option>
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No users found</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name || 'No name'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="uppercase">
                        {user.localePreference}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {user.emailVerified ? (
                          <Badge variant="success">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Unverified</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pagination.pages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <p className="text-sm text-gray-500">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
                    of {pagination.total} users
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page - 1,
                        }))
                      }
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }))
                      }
                      disabled={pagination.page === pagination.pages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Add New User</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-4 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {formError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newUserForm.name}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, password: e.target.value })
                  }
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={newUserForm.role}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, role: e.target.value })
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="locale">Language Preference</Label>
                <select
                  id="locale"
                  value={newUserForm.localePreference}
                  onChange={(e) =>
                    setNewUserForm({
                      ...newUserForm,
                      localePreference: e.target.value,
                    })
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Edit User</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditUser} className="p-4 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {formError}
                </div>
              )}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedUser.email}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editName">Name</Label>
                <Input
                  id="editName"
                  value={editUserForm.name}
                  onChange={(e) =>
                    setEditUserForm({ ...editUserForm, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRole">Role</Label>
                <select
                  id="editRole"
                  value={editUserForm.role}
                  onChange={(e) =>
                    setEditUserForm({ ...editUserForm, role: e.target.value })
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLocale">Language Preference</Label>
                <select
                  id="editLocale"
                  value={editUserForm.localePreference}
                  onChange={(e) =>
                    setEditUserForm({
                      ...editUserForm,
                      localePreference: e.target.value,
                    })
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
