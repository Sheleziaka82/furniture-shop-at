import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';

export interface UserData {
  id?: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee' | 'moderator' | 'user';
  department: string;
  isActive: boolean;
}

interface UserManagementProps {
  onAddUser?: (user: UserData) => Promise<void>;
  onUpdateUser?: (user: UserData) => Promise<void>;
  onDeleteUser?: (userId: number) => Promise<void>;
}

const ROLES = [
  {
    value: 'admin',
    label: 'Administrator',
    description: 'Полный доступ ко всем функциям',
    permissions: ['all'],
  },
  {
    value: 'manager',
    label: 'Менеджер',
    description: 'Управление продуктами и заказами',
    permissions: ['products', 'orders', 'customers', 'reports'],
  },
  {
    value: 'employee',
    label: 'Сотрудник',
    description: 'Обработка заказов и поддержка',
    permissions: ['orders', 'customers'],
  },
  {
    value: 'moderator',
    label: 'Модератор',
    description: 'Управление отзывами и контентом',
    permissions: ['reviews', 'content'],
  },
  {
    value: 'user',
    label: 'Пользователь',
    description: 'Только просмотр профиля',
    permissions: ['profile'],
  },
];

const DEPARTMENTS = [
  { value: 'sales', label: 'Продажи' },
  { value: 'support', label: 'Поддержка' },
  { value: 'warehouse', label: 'Склад' },
  { value: 'marketing', label: 'Маркетинг' },
  { value: 'management', label: 'Управление' },
  { value: 'it', label: 'IT' },
];

export function UserManagement({ onAddUser, onUpdateUser, onDeleteUser }: UserManagementProps) {
  const [users, setUsers] = useState<UserData[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    role: 'employee',
    department: 'support',
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleActive = () => {
    setFormData((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Имя обязательно');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email обязателен');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // Update existing user
        const updatedUsers = users.map((u) =>
          u.id === editingId ? { ...formData, id: editingId } : u
        );
        setUsers(updatedUsers);
        if (onUpdateUser) {
          await onUpdateUser({ ...formData, id: editingId });
        }
        toast.success('Пользователь обновлен');
      } else {
        // Add new user
        const newUser: UserData = {
          ...formData,
          id: Math.max(...users.map((u) => u.id || 0), 0) + 1,
        };
        setUsers([...users, newUser]);
        if (onAddUser) {
          await onAddUser(newUser);
        }
        toast.success('Пользователь добавлен');
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'employee',
        department: 'support',
        isActive: true,
      });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      toast.error('Ошибка при сохранении пользователя');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user: UserData) => {
    setFormData(user);
    setEditingId(user.id || null);
    setShowForm(true);
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        setUsers(users.filter((u) => u.id !== userId));
        if (onDeleteUser) {
          await onDeleteUser(userId);
        }
        toast.success('Пользователь удален');
      } catch (error) {
        toast.error('Ошибка при удалении пользователя');
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      role: 'employee',
      department: 'support',
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getRoleInfo = (role: string) => {
    return ROLES.find((r) => r.value === role);
  };

  const getDepartmentLabel = (dept: string) => {
    return DEPARTMENTS.find((d) => d.value === dept)?.label || dept;
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Редактировать пользователя' : 'Добавить нового пользователя'}</CardTitle>
            <CardDescription>
              {editingId
                ? 'Обновите информацию о пользователе'
                : 'Заполните все необходимые поля'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Иван Петров"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ivan@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Роль *</Label>
                  <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    {getRoleInfo(formData.role)?.description}
                  </p>
                </div>

                <div>
                  <Label htmlFor="department">Отдел *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange('department', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите отдел" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleToggleActive}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Активный пользователь</span>
                </label>
              </div>

              <div className="flex gap-4 border-t pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Сохранение...' : editingId ? 'Обновить' : 'Добавить'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Управление пользователями</CardTitle>
              <CardDescription>
                Всего пользователей: {users.length}
              </CardDescription>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>+ Добавить пользователя</Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Пользователи не найдены
            </p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => {
                const roleInfo = getRoleInfo(user.role);
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        <div className="flex items-center gap-1">
                          {user.isActive ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {user.isActive ? 'Активен' : 'Неактивен'}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Email: {user.email}</p>
                        <p>
                          Роль:{' '}
                          <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold">
                            {roleInfo?.label}
                          </span>
                        </p>
                        <p>Отдел: {getDepartmentLabel(user.department)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Редактировать
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(user.id!)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Roles Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Справка по ролям</CardTitle>
          <CardDescription>Описание прав доступа для каждой роли</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLES.map((role) => (
              <div key={role.value} className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">{role.label}</h4>
                <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="inline-block px-2 py-1 bg-muted text-xs rounded font-medium"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
