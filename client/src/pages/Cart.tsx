import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function Cart() {
  const { t } = useLanguage();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = getTotalPrice();
  const shippingCost = subtotal >= 50000 ? 0 : 1500; // Free shipping over 500 EUR
  const discountAmount = Math.round((subtotal * discount) / 100);
  const total = subtotal + shippingCost - discountAmount;

  const handleApplyPromo = () => {
    // Mock promo code validation
    if (promoCode === 'SAVE10') {
      setDiscount(10);
    } else if (promoCode === 'SAVE20') {
      setDiscount(20);
    } else {
      setDiscount(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-primary hover:text-primary/80">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-4xl font-bold">{t('cart.title')}</h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-8">{t('cart.empty')}</p>
              <Link href="/catalog">
                <Button size="lg">{t('cart.continue_shopping')}</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-6 border-b border-border last:border-b-0"
                    >
                      {/* Image */}
                      <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.productName}</h3>
                        {item.variantColor && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Farbe: {item.variantColor}
                          </p>
                        )}
                        <p className="text-lg font-bold text-primary">{item.price} EUR</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 border border-border rounded-lg p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="p-1 hover:bg-muted rounded transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.quantity} x {item.price} EUR
                        </p>
                        <p className="text-lg font-bold">
                          {item.price * item.quantity} EUR
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <Link href="/catalog" className="block mt-6">
                  <Button variant="outline" className="w-full">
                    {t('cart.continue_shopping')}
                  </Button>
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Bestellübersicht</h2>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <label className="text-sm font-semibold mb-2 block">
                      {t('cart.promo_code')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="z.B. SAVE10"
                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyPromo}
                        className="px-4"
                      >
                        {t('cart.apply')}
                      </Button>
                    </div>
                    {discount > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ Rabatt {discount}% angewendet
                      </p>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                      <span className="font-semibold">{(subtotal / 100).toFixed(2)} EUR</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Rabatt ({discount}%)</span>
                        <span>-{(discountAmount / 100).toFixed(2)} EUR</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('cart.shipping')}</span>
                      <span className="font-semibold">
                        {shippingCost === 0 ? (
                          <span className="text-green-600">Kostenlos</span>
                        ) : (
                          `${(shippingCost / 100).toFixed(2)} EUR`
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold">{t('cart.total')}</span>
                    <span className="text-2xl font-bold text-primary">
                      {(total / 100).toFixed(2)} EUR
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Link href="/checkout">
                    <Button size="lg" className="w-full">
                      {t('cart.proceed_checkout')}
                    </Button>
                  </Link>

                  {/* Trust Info */}
                  <div className="mt-6 pt-6 border-t border-border space-y-2 text-xs text-muted-foreground">
                    <p>✓ Sichere Zahlung mit SSL-Verschlüsselung</p>
                    <p>✓ 30 Tage Rückgaberecht</p>
                    <p>✓ Kostenlose Retouren</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
