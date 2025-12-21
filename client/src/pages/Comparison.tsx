import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useComparison } from '@/contexts/ComparisonContext';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { X, ShoppingCart, Share2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Comparison() {
  const { t } = useLanguage();
  const { products, removeProduct, clearComparison } = useComparison();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link kopiert!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Vergleich</h1>
            <p className="text-muted-foreground mb-8">
              Sie haben noch keine Produkte zum Vergleichen ausgewählt.
            </p>
            <Link href="/catalog">
              <Button className="gap-2">
                Zum Katalog <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Comparison attributes
  const attributes = [
    { key: 'price', label: 'Preis' },
    { key: 'category', label: 'Kategorie' },
    { key: 'material', label: 'Material' },
    { key: 'color', label: 'Farbe' },
    { key: 'dimensions', label: 'Abmessungen' },
    { key: 'weight', label: 'Gewicht' },
    { key: 'rating', label: 'Bewertung' },
    { key: 'reviews', label: 'Bewertungen' },
    { key: 'inStock', label: 'Verfügbarkeit' },
  ];

  const getAttributeValue = (product: any, key: string) => {
    if (key === 'price') {
      return `${(product.price / 100).toFixed(2)} EUR`;
    }
    if (key === 'dimensions') {
      return `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`;
    }
    if (key === 'weight') {
      return `${product.weight} kg`;
    }
    if (key === 'rating') {
      return `${product.rating.toFixed(1)} / 5`;
    }
    if (key === 'inStock') {
      return product.inStock ? 'Verfügbar' : 'Nicht verfügbar';
    }
    return product[key] || '—';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Produktvergleich</h1>
              <p className="text-muted-foreground">
                {products.length} von 4 Produkten ausgewählt
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                {copied ? 'Kopiert!' : 'Teilen'}
              </Button>
              {products.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearComparison}
                >
                  Alle löschen
                </Button>
              )}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-6 py-4 text-left font-semibold w-48">
                      Attribute
                    </th>
                    {products.map((product) => (
                      <th key={product.id} className="px-6 py-4 text-center w-56">
                        <div className="flex flex-col items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                          <div className="text-center">
                            <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                              {product.name}
                            </h3>
                            <p className="text-lg font-bold text-primary mb-3">
                              {(product.price / 100).toFixed(2)} EUR
                            </p>
                            <div className="flex gap-2 justify-center">
                              <Link href={`/product/${product.id}`}>
                                <Button size="sm" variant="outline">
                                  Details
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                className="gap-1"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                In den Warenkorb
                              </Button>
                            </div>
                          </div>
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title="Aus Vergleich entfernen"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attributes.map((attr) => (
                    <tr key={attr.key} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-sm sticky left-0 bg-card z-10">
                        {attr.label}
                      </td>
                      {products.map((product) => (
                        <td
                          key={`${product.id}-${attr.key}`}
                          className="px-6 py-4 text-center text-sm"
                        >
                          {getAttributeValue(product, attr.key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Comparison Tips */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-8">
            <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">
              💡 Vergleichstipps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-800 dark:text-blue-200">
              <div>
                <p className="font-semibold mb-2">Abmessungen vergleichen</p>
                <p className="text-sm">
                  Überprüfen Sie die Breite, Höhe und Tiefe, um sicherzustellen, dass
                  das Möbelstück in Ihren Raum passt.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">Material und Qualität</p>
                <p className="text-sm">
                  Vergleichen Sie Materialien und Verarbeitungsqualität, um die beste
                  Wahl für Ihre Bedürfnisse zu treffen.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">Kundenbewertungen</p>
                <p className="text-sm">
                  Lesen Sie die Bewertungen anderer Kunden, um Haltbarkeit und
                  Zufriedenheit zu verstehen.
                </p>
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Möchten Sie weitere Produkte vergleichen?
            </p>
            <Link href="/catalog">
              <Button className="gap-2">
                Zum Katalog <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
