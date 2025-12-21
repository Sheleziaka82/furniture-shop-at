import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ShoppingCart, AlertCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AbandonedCart() {
  const { t } = useLanguage();
  const { items, getTotalPrice } = useCart();
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const subtotal = getTotalPrice();
  const shippingCost = 1500;
  const total = subtotal + shippingCost;

  const handleSendReminder = () => {
    if (!email) {
      toast.error('Bitte geben Sie Ihre E-Mail-Adresse ein');
      return;
    }
    toast.success('Erinnerung wurde gesendet!');
    setEmailSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              Sie haben etwas in Ihrem Warenkorb vergessen!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ihre sorgfältig ausgewählten Möbelstücke warten noch auf Sie. Schließen Sie
              Ihren Einkauf ab und erhalten Sie exklusive Angebote.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {items.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground mb-6">
                    Ihr Warenkorb ist leer
                  </p>
                  <Link href="/catalog">
                    <Button>{t('cart.continue_shopping')}</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-card border border-border rounded-lg p-6 flex gap-6"
                    >
                      <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{item.productName}</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          Menge: {item.quantity}
                        </p>
                        <p className="font-bold text-lg text-primary">
                          {(item.price / 100).toFixed(2)} EUR
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Incentive Section */}
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-8 mt-8">
                <h3 className="text-xl font-bold mb-4 text-green-900 dark:text-green-100">
                  🎁 Spezialangebot für Sie!
                </h3>
                <p className="text-green-800 dark:text-green-200 mb-4">
                  Erhalten Sie <span className="font-bold">10% Rabatt</span> auf Ihren
                  Einkauf, wenn Sie ihn heute noch abschließen!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Angebot gültig für die nächsten 24 Stunden
                </p>
              </div>

              {/* Trust Section */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary mb-2">✓</p>
                  <p className="text-sm font-semibold">Sichere Zahlung</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary mb-2">🚚</p>
                  <p className="text-sm font-semibold">Schnelle Lieferung</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary mb-2">↩</p>
                  <p className="text-sm font-semibold">30 Tage Rückgabe</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Order Summary */}
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24 mb-6">
                <h2 className="text-xl font-bold mb-6">Bestellübersicht</h2>
                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Zwischensumme</span>
                    <span className="font-semibold">{(subtotal / 100).toFixed(2)} EUR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Versand</span>
                    <span className="font-semibold">
                      {(shippingCost / 100).toFixed(2)} EUR
                    </span>
                  </div>
                  <div className="flex justify-between text-sm bg-green-50 dark:bg-green-950 p-2 rounded">
                    <span className="text-green-700 dark:text-green-300 font-semibold">
                      Rabatt (10%)
                    </span>
                    <span className="text-green-700 dark:text-green-300 font-bold">
                      -{((subtotal * 0.1) / 100).toFixed(2)} EUR
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Gesamt</span>
                  <span className="text-primary">
                    {((total - subtotal * 0.1) / 100).toFixed(2)} EUR
                  </span>
                </div>
                <Link href="/checkout">
                  <Button className="w-full mb-4">Zum Checkout</Button>
                </Link>
                <Link href="/catalog">
                  <Button variant="outline" className="w-full">
                    Weiter einkaufen
                  </Button>
                </Link>
              </div>

              {/* Email Reminder */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Erinnerung per E-Mail</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Wir senden Ihnen eine Erinnerung mit Ihrem Warenkorb
                </p>
                {!emailSent ? (
                  <>
                    <input
                      type="email"
                      placeholder="Ihre E-Mail-Adresse"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleSendReminder}
                    >
                      Erinnerung senden
                    </Button>
                  </>
                ) : (
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                    <p className="text-green-700 dark:text-green-200 font-semibold">
                      ✓ Erinnerung gesendet!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-8">Häufig gestellte Fragen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">Wie lange ist das Angebot gültig?</h3>
                <p className="text-muted-foreground">
                  Das 10% Rabattangebot ist 24 Stunden lang gültig. Danach wird der
                  Standardpreis berechnet.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Kann ich meine Bestellung ändern?</h3>
                <p className="text-muted-foreground">
                  Ja, Sie können Ihre Bestellung im Checkout jederzeit ändern, bevor Sie
                  bezahlen.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Wie lange dauert die Lieferung?</h3>
                <p className="text-muted-foreground">
                  Standardversand dauert 5-7 Werktage. Expressversand ist in 2-3 Werktagen
                  verfügbar.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Gibt es eine Rückgabegarantie?</h3>
                <p className="text-muted-foreground">
                  Ja, Sie können alle Produkte innerhalb von 30 Tagen zurückgeben, wenn Sie
                  nicht zufrieden sind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
