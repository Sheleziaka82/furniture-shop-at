import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { LogOut, Heart, MapPin, Package, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Tab = 'orders' | 'wishlist' | 'addresses' | 'settings';

export default function Account() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  // Mock data
  const orders = [
    {
      id: '12345',
      date: '2025-01-15',
      total: 2499,
      status: 'Delivered',
      items: 2,
    },
    {
      id: '12344',
      date: '2025-01-10',
      total: 1599,
      status: 'In Transit',
      items: 1,
    },
    {
      id: '12343',
      date: '2025-01-05',
      total: 3299,
      status: 'Delivered',
      items: 3,
    },
  ];

  const wishlist = [
    {
      id: 1,
      name: 'Modernes Sofa Premium',
      price: 1299,
      image: 'https://via.placeholder.com/200x200?text=Sofa',
    },
    {
      id: 2,
      name: 'Skandinavischer Tisch',
      price: 399,
      image: 'https://via.placeholder.com/200x200?text=Tisch',
    },
  ];

  const addresses = [
    {
      id: 1,
      type: 'Home',
      street: 'Beispielstraße 123',
      city: '1010 Wien',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Work',
      street: 'Geschäftsstraße 456',
      city: '1020 Wien',
      isDefault: false,
    },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success('Sie wurden abgemeldet');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mein Konto</h1>
              <p className="text-muted-foreground">
                Willkommen, {user?.name || 'Benutzer'}!
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Abmelden
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <nav className="flex flex-col">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center gap-3 px-6 py-4 border-b border-border transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    <span className="font-semibold">{t('account.orders')}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`flex items-center gap-3 px-6 py-4 border-b border-border transition-colors ${
                      activeTab === 'wishlist'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                    <span className="font-semibold">{t('account.wishlist')}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`flex items-center gap-3 px-6 py-4 border-b border-border transition-colors ${
                      activeTab === 'addresses'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold">{t('account.addresses')}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-3 px-6 py-4 transition-colors ${
                      activeTab === 'settings'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-semibold">{t('account.settings')}</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">{t('account.orders')}</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12 bg-card border border-border rounded-lg">
                      <p className="text-muted-foreground mb-4">
                        Sie haben noch keine Bestellungen
                      </p>
                      <Link href="/catalog">
                        <Button>{t('cart.continue_shopping')}</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Bestellnummer: {order.id}
                              </p>
                              <p className="font-semibold text-lg">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                {(order.total / 100).toFixed(2)} EUR
                              </p>
                              <p
                                className={`text-sm font-semibold ${
                                  order.status === 'Delivered'
                                    ? 'text-green-600'
                                    : 'text-yellow-600'
                                }`}
                              >
                                {order.status === 'Delivered'
                                  ? '✓ Zugestellt'
                                  : '⏱ Unterwegs'}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {order.items} Artikel
                          </p>
                          <Button variant="outline" className="w-full">
                            Bestelldetails anzeigen
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">{t('account.wishlist')}</h2>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12 bg-card border border-border rounded-lg">
                      <p className="text-muted-foreground mb-4">
                        Ihre Wunschliste ist leer
                      </p>
                      <Link href="/catalog">
                        <Button>{t('cart.continue_shopping')}</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {wishlist.map((item) => (
                        <div
                          key={item.id}
                          className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="aspect-square bg-muted overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-2 line-clamp-2">
                              {item.name}
                            </h3>
                            <p className="text-lg font-bold text-primary mb-4">
                              {(item.price).toFixed(2)} EUR
                            </p>
                            <Button className="w-full">
                              {t('common.add_to_cart')}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{t('account.addresses')}</h2>
                    <Button>{t('account.add_address')}</Button>
                  </div>
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="bg-card border border-border rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-semibold text-lg mb-2">
                              {address.type}
                            </p>
                            <p className="text-muted-foreground">
                              {address.street}
                            </p>
                            <p className="text-muted-foreground">{address.city}</p>
                          </div>
                          {address.isDefault && (
                            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                              Standard
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Bearbeiten
                          </Button>
                          <Button variant="outline" size="sm">
                            Löschen
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">{t('account.settings')}</h2>
                  <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Kontoinformationen</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            defaultValue={user?.name || ''}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            E-Mail
                          </label>
                          <input
                            type="email"
                            defaultValue={user?.email || ''}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="font-semibold mb-4">Sicherheit</h3>
                      <Button variant="outline">Passwort ändern</Button>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="font-semibold mb-4">Benachrichtigungen</h3>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm">
                          E-Mail-Benachrichtigungen für Bestellungen
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer mt-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm">
                          Werbung und spezielle Angebote
                        </span>
                      </label>
                    </div>

                    <div className="border-t border-border pt-6">
                      <Button className="w-full">Änderungen speichern</Button>
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
