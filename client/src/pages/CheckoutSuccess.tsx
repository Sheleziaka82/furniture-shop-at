import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { CheckCircle, Package, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';

export default function CheckoutSuccess() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Extract session_id from URL query params
    const params = new URLSearchParams(window.location.search);
    const id = params.get('session_id');
    if (id) {
      setSessionId(id);
    }
  }, [location]);

  const { data: session, isLoading } = trpc.stripe.getSession.useQuery(
    sessionId || '',
    {
      enabled: !!sessionId,
    }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container max-w-2xl">
          <div className="text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold mb-4">
              {t('checkout.success.title') || 'Zahlung erfolgreich!'}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t('checkout.success.message') ||
                'Vielen Dank für Ihre Bestellung. Wir haben Ihre Zahlung erhalten und werden Ihre Bestellung schnellstmöglich bearbeiten.'}
            </p>

            {/* Order Details */}
            {isLoading && (
              <div className="bg-card border border-border rounded-lg p-8 mb-8">
                <p className="text-muted-foreground">Lade Bestelldetails...</p>
              </div>
            )}

            {session && (
              <div className="bg-card border border-border rounded-lg p-8 mb-8 text-left">
                <h2 className="text-xl font-semibold mb-4">Bestelldetails</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bestellnummer:</span>
                    <span className="font-medium">{session.id.slice(-12).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gesamtbetrag:</span>
                    <span className="font-medium">
                      €{((session.amount_total || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zahlungsstatus:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {session.payment_status === 'paid' ? 'Bezahlt' : 'Ausstehend'}
                    </span>
                  </div>
                  {session.customer_email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">E-Mail:</span>
                      <span className="font-medium">{session.customer_email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-accent/50 border border-border rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Was passiert als Nächstes?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Sie erhalten eine Bestellbestätigung per E-Mail</li>
                <li>✓ Wir bereiten Ihre Bestellung für den Versand vor</li>
                <li>✓ Sie erhalten eine Versandbenachrichtigung mit Tracking-Nummer</li>
                <li>✓ Ihre Möbel werden in 3-5 Werktagen geliefert</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/account">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Package className="w-4 h-4 mr-2" />
                  Meine Bestellungen
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full sm:w-auto">
                  <Home className="w-4 h-4 mr-2" />
                  Zurück zur Startseite
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
