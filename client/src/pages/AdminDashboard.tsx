import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ProductForm, type ProductFormData } from '@/components/ProductForm';
import { UserManagement } from '@/components/UserManagement';
import AdminOrders from './AdminOrders';
import {
  BarChart3,
  Package,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  ShoppingCart,
  AlertCircle,
  ArrowLeft,
  UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'customers' | 'settings' | 'users';
type ProductsSubTab = 'list' | 'add';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [productsSubTab, setProductsSubTab] = useState<ProductsSubTab>('list');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Zugriff verweigert</h1>
            <p className="text-muted-foreground mb-6">
              Sie haben keine Berechtigung, auf diesen Bereich zuzugreifen.
            </p>
            <Link href="/">
              <Button>Zur Startseite</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Mock data
  const stats = [
    {
      label: 'Gesamtumsatz',
      value: '45.230 EUR',
      change: '+12%',
      icon: TrendingUp,
    },
    {
      label: 'Bestellungen',
      value: '1.234',
      change: '+8%',
      icon: ShoppingCart,
    },
    {
      label: 'Produkte',
      value: '456',
      change: '+5%',
      icon: Package,
    },
    {
      label: 'Kunden',
      value: '2.890',
      change: '+15%',
      icon: Users,
    },
  ];

  const recentOrders = [
    {
      id: '12345',
      customer: 'Maria Schmidt',
      amount: 2499,
      status: 'Delivered',
      date: '2025-01-15',
    },
    {
      id: '12344',
      customer: 'Hans Müller',
      amount: 1599,
      status: 'Processing',
      date: '2025-01-14',
    },
    {
      id: '12343',
      customer: 'Anna Weber',
      amount: 3299,
      status: 'Pending',
      date: '2025-01-13',
    },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success('Sie wurden abgemeldet');
  };

  const createProductMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success('Produkt erfolgreich hinzugefügt');
      setProductsSubTab('list');
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error('Fehler beim Hinzufügen des Produkts: ' + error.message);
      setIsSubmitting(false);
    },
  });

  const handleAddProduct = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      await createProductMutation.mutateAsync(data);
    } catch (error) {
      // Error already handled in onError
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Willkommen, {user?.name || 'Administrator'}!
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Abmelden
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg overflow-hidden sticky top-24">
                <nav className="flex flex-col">
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setProductsSubTab('list');
                    }}
                    className={`flex items-center gap-3 px-6 py-4 border-b border-border transition-colors ${
                      activeTab === 'dashboard'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-semibold">Dashboard</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('products')}
                    className={`flex items-center gap-3 px-6 py-4 border-b border-border transition-colors ${
                      activeTab === 'products'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    <span className="font-semibold">Produkte</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('orders');
                      setProductsSubTab('list');
                    }}
                    className={`flex items-center gap-3 px-6 py-4 border-b border-border transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="font-semibold">Bestellungen</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('customers');
                      setProductsSubTab('list');
                    }}
                    className={`flex items-center gap-3 px-6 py-4 border-b border-border transition-colors ${
                      activeTab === 'customers'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">Kunden</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('users');
                      setProductsSubTab('list');
                    }}
                    className={`flex items-center gap-3 px-6 py-4 border-b border-border transition-colors ${
                      activeTab === 'users'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="font-semibold">Пользователи</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setProductsSubTab('list');
                    }}
                    className={`flex items-center gap-3 px-6 py-4 transition-colors ${
                      activeTab === 'settings'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-semibold">Einstellungen</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={stat.label}
                          className="bg-card border border-border rounded-lg p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-muted-foreground font-semibold">
                              {stat.label}
                            </p>
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <p className="text-3xl font-bold mb-2">{stat.value}</p>
                          <p className="text-sm text-green-600">{stat.change} vs. letzten Monat</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Letzte Bestellungen</h2>
                      <Link href="/admin/orders">
                        <Button variant="outline" size="sm">
                          Alle anzeigen
                        </Button>
                      </Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold">
                              Bestellnummer
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">Kunde</th>
                            <th className="text-left py-3 px-4 font-semibold">Betrag</th>
                            <th className="text-left py-3 px-4 font-semibold">Status</th>
                            <th className="text-left py-3 px-4 font-semibold">Datum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr
                              key={order.id}
                              className="border-b border-border hover:bg-muted transition-colors"
                            >
                              <td className="py-3 px-4 font-semibold">{order.id}</td>
                              <td className="py-3 px-4">{order.customer}</td>
                              <td className="py-3 px-4">
                                {(order.amount / 100).toFixed(2)} EUR
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    order.status === 'Delivered'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : order.status === 'Processing'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  }`}
                                >
                                  {order.status === 'Delivered'
                                    ? 'Zugestellt'
                                    : order.status === 'Processing'
                                    ? 'Bearbeitung'
                                    : 'Ausstehend'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {order.date}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div>
                  {productsSubTab === 'list' ? (
                    <div className="bg-card border border-border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Produktverwaltung</h2>
                        <Button onClick={() => setProductsSubTab('add')}>
                          + Neues Produkt
                        </Button>
                      </div>
                      <p className="text-muted-foreground">
                        Produktliste wird hier angezeigt (in Entwicklung)
                      </p>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => setProductsSubTab('list')}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Zurück zur Liste
                      </button>
                      <ProductForm
                        onSubmit={handleAddProduct}
                        onCancel={() => setProductsSubTab('list')}
                        isLoading={isSubmitting}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <AdminOrders />
                </div>
              )}

              {/* Customers Tab */}
              {activeTab === 'customers' && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-6">Kundenverwaltung</h2>
                  <p className="text-muted-foreground">
                    Kundenverwaltungsbereich wird hier angezeigt
                  </p>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  <UserManagement />
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-6">Einstellungen</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Sicherheit</h3>
                      <Button variant="outline">
                        Zwei-Faktor-Authentifizierung aktivieren
                      </Button>
                    </div>
                    <div className="border-t border-border pt-6">
                      <h3 className="font-semibold mb-4">Benachrichtigungen</h3>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm">
                          E-Mail-Benachrichtigungen für neue Bestellungen
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer mt-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm">
                          Benachrichtigungen für niedrige Lagerbestände
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
