import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth';
import { Link, useLocation } from 'wouter';
import { ChevronRight, Lock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

type CheckoutStep = 'contact' | 'address' | 'shipping' | 'payment' | 'review';

export default function Checkout() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { items, getTotalPrice } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact');

  // Form states
  const [contact, setContact] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    phone: '',
  });

  const [address, setAddress] = useState({
    street: '',
    streetNumber: '',
    postalCode: '',
    city: '',
    country: 'AT',
  });

  const [shipping, setShipping] = useState({
    method: 'standard',
  });

  const [payment, setPayment] = useState({
    method: 'card',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const subtotal = getTotalPrice();
  const shippingCost = shipping.method === 'express' ? 2500 : 1500;
  const total = subtotal + shippingCost;

  const steps: { id: CheckoutStep; label: string }[] = [
    { id: 'contact', label: t('checkout.contact') },
    { id: 'address', label: t('checkout.address') },
    { id: 'shipping', label: t('checkout.shipping') },
    { id: 'payment', label: t('checkout.payment') },
    { id: 'review', label: t('checkout.review') },
  ];

  const handleNextStep = () => {
    const stepIndex = steps.findIndex((s) => s.id === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id);
    }
  };

  const handlePrevStep = () => {
    const stepIndex = steps.findIndex((s) => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id);
    }
  };

  const [, setLocation] = useLocation();
  const createCheckoutSession = trpc.stripe.createCheckoutSession.useMutation();

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error(t('auth.loginRequired'));
      return;
    }

    // Validate all fields
    if (!contact.email || !contact.firstName || !contact.phone) {
      toast.error('Bitte füllen Sie alle Kontaktfelder aus');
      setCurrentStep('contact');
      return;
    }

    if (!address.street || !address.postalCode || !address.city) {
      toast.error('Bitte füllen Sie alle Adressfelder aus');
      setCurrentStep('address');
      return;
    }

    try {
      // Prepare cart items for Stripe
      const cartItems = items.map(item => ({
        productName: item.productName,
        productDescription: undefined,
        productImage: item.imageUrl || undefined,
        price: item.price, // already in cents
        quantity: item.quantity,
      }));

      // Create Stripe checkout session
      const result = await createCheckoutSession.mutateAsync({
        cartItems,
        shippingMethod: shipping.method as 'standard' | 'express' | 'pickup' | 'assembly',
        promoCode: undefined,
        discountAmount: 0,
      });

      if (result.url) {
        // Show toast and redirect to Stripe checkout
        toast.info('Sie werden zur Zahlungsseite weitergeleitet...');
        window.open(result.url, '_blank');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error('Fehler beim Erstellen der Zahlung. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-4xl font-bold mb-8">{t('checkout.title')}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                      <button
                        onClick={() => setCurrentStep(step.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                          currentStep === step.id
                            ? 'bg-primary text-primary-foreground'
                            : steps.findIndex((s) => s.id === currentStep) > index
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {steps.findIndex((s) => s.id === currentStep) > index ? '✓' : index + 1}
                      </button>
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-2 transition-all ${
                            steps.findIndex((s) => s.id === currentStep) > index
                              ? 'bg-green-500'
                              : 'bg-muted'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  {steps.map((step) => (
                    <span key={step.id} className="flex-1">
                      {step.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-card border border-border rounded-lg p-8 mb-8">
                {/* Contact Step */}
                {currentStep === 'contact' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">{t('checkout.contact')}</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          E-Mail-Adresse
                        </label>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) =>
                            setContact({ ...contact, email: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Vorname
                          </label>
                          <input
                            type="text"
                            value={contact.firstName}
                            onChange={(e) =>
                              setContact({ ...contact, firstName: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Nachname
                          </label>
                          <input
                            type="text"
                            value={contact.lastName}
                            onChange={(e) =>
                              setContact({ ...contact, lastName: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Telefonnummer
                        </label>
                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={(e) =>
                            setContact({ ...contact, phone: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Step */}
                {currentStep === 'address' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">{t('checkout.address')}</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-semibold mb-2">
                            Straße
                          </label>
                          <input
                            type="text"
                            value={address.street}
                            onChange={(e) =>
                              setAddress({ ...address, street: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Hausnummer
                          </label>
                          <input
                            type="text"
                            value={address.streetNumber}
                            onChange={(e) =>
                              setAddress({ ...address, streetNumber: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Postleitzahl
                          </label>
                          <input
                            type="text"
                            value={address.postalCode}
                            onChange={(e) =>
                              setAddress({ ...address, postalCode: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">
                            Stadt
                          </label>
                          <input
                            type="text"
                            value={address.city}
                            onChange={(e) =>
                              setAddress({ ...address, city: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Land
                        </label>
                        <select
                          value={address.country}
                          onChange={(e) =>
                            setAddress({ ...address, country: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="AT">Österreich</option>
                          <option value="DE">Deutschland</option>
                          <option value="CH">Schweiz</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Step */}
                {currentStep === 'shipping' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">{t('checkout.shipping')}</h2>
                    <div className="space-y-4">
                      <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <input
                          type="radio"
                          name="shipping"
                          value="standard"
                          checked={shipping.method === 'standard'}
                          onChange={(e) =>
                            setShipping({ ...shipping, method: e.target.value })
                          }
                          className="w-4 h-4"
                        />
                        <div className="ml-4 flex-1">
                          <p className="font-semibold">Standardversand</p>
                          <p className="text-sm text-muted-foreground">
                            Lieferung in 5-7 Werktagen
                          </p>
                        </div>
                        <p className="font-bold">15,00 EUR</p>
                      </label>
                      <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <input
                          type="radio"
                          name="shipping"
                          value="express"
                          checked={shipping.method === 'express'}
                          onChange={(e) =>
                            setShipping({ ...shipping, method: e.target.value })
                          }
                          className="w-4 h-4"
                        />
                        <div className="ml-4 flex-1">
                          <p className="font-semibold">Expressversand</p>
                          <p className="text-sm text-muted-foreground">
                            Lieferung in 2-3 Werktagen
                          </p>
                        </div>
                        <p className="font-bold">25,00 EUR</p>
                      </label>
                    </div>
                  </div>
                )}

                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">{t('checkout.payment')}</h2>
                    <div className="space-y-4">
                      <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={payment.method === 'card'}
                          onChange={(e) =>
                            setPayment({ ...payment, method: e.target.value })
                          }
                          className="w-4 h-4"
                        />
                        <span className="ml-4 font-semibold">Kreditkarte</span>
                      </label>
                      <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="paypal"
                          checked={payment.method === 'paypal'}
                          onChange={(e) =>
                            setPayment({ ...payment, method: e.target.value })
                          }
                          className="w-4 h-4"
                        />
                        <span className="ml-4 font-semibold">PayPal</span>
                      </label>
                      <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value="bank"
                          checked={payment.method === 'bank'}
                          onChange={(e) =>
                            setPayment({ ...payment, method: e.target.value })
                          }
                          className="w-4 h-4"
                        />
                        <span className="ml-4 font-semibold">Banküberweisung</span>
                      </label>

                      {payment.method === 'card' && (
                        <div className="mt-6 space-y-4 p-4 bg-muted rounded-lg">
                          <div>
                            <label className="block text-sm font-semibold mb-2">
                              Karteninhaber
                            </label>
                            <input
                              type="text"
                              value={payment.cardName}
                              onChange={(e) =>
                                setPayment({ ...payment, cardName: e.target.value })
                              }
                              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2">
                              Kartennummer
                            </label>
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              value={payment.cardNumber}
                              onChange={(e) =>
                                setPayment({
                                  ...payment,
                                  cardNumber: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold mb-2">
                                Ablaufdatum
                              </label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={payment.cardExpiry}
                                onChange={(e) =>
                                  setPayment({
                                    ...payment,
                                    cardExpiry: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-2">
                                CVC
                              </label>
                              <input
                                type="text"
                                placeholder="123"
                                value={payment.cardCvc}
                                onChange={(e) =>
                                  setPayment({
                                    ...payment,
                                    cardCvc: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Review Step */}
                {currentStep === 'review' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Bestellübersicht</h2>
                    <div className="space-y-6">
                      <div className="border-b border-border pb-6">
                        <h3 className="font-semibold mb-4">Kontaktinformationen</h3>
                        <p className="text-sm text-muted-foreground">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                        <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      </div>
                      <div className="border-b border-border pb-6">
                        <h3 className="font-semibold mb-4">Lieferadresse</h3>
                        <p className="text-sm text-muted-foreground">
                          {address.street} {address.streetNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.postalCode} {address.city}
                        </p>
                      </div>
                      <div className="border-b border-border pb-6">
                        <h3 className="font-semibold mb-4">Versandart</h3>
                        <p className="text-sm text-muted-foreground">
                          {shipping.method === 'express'
                            ? 'Expressversand (2-3 Werktage)'
                            : 'Standardversand (5-7 Werktage)'}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-4">Zahlungsart</h3>
                        <p className="text-sm text-muted-foreground">
                          {payment.method === 'card'
                            ? 'Kreditkarte'
                            : payment.method === 'paypal'
                            ? 'PayPal'
                            : 'Banküberweisung'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {currentStep !== 'contact' && (
                  <Button variant="outline" onClick={handlePrevStep}>
                    Zurück
                  </Button>
                )}
                {currentStep !== 'review' && (
                  <Button onClick={handleNextStep} className="flex-1">
                    Weiter <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {currentStep === 'review' && (
                  <Button onClick={handlePlaceOrder} className="flex-1">
                    <Lock className="w-4 h-4 mr-2" />
                    Bestellung abschließen
                  </Button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Bestellübersicht</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.productName} x {item.quantity}
                      </span>
                      <span className="font-semibold">
                        {(item.price * item.quantity) / 100} EUR
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-3 mb-6">
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
                  <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
                    <span>Gesamt</span>
                    <span className="text-primary">{(total / 100).toFixed(2)} EUR</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                  <p className="text-xs text-green-700 dark:text-green-300">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Sichere SSL-Verschlüsselung
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
