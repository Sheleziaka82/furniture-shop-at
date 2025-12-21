import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Truck, Shield, Leaf, MessageCircle } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 to-accent/10 py-20 md:py-32">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                  Exquisite Möbel für Ihr Zuhause
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Entdecken Sie unsere Premium-Kollektion von handgefertigten Möbeln, die Eleganz und Funktionalität vereinen.
                </p>
                <div className="flex gap-4">
                  <Link href="/catalog">
                    <Button size="lg" className="gap-2">
                      {t('nav.catalog')} <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline">
                    Mehr erfahren
                  </Button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary to-accent rounded-lg h-96 flex items-center justify-center text-primary-foreground text-center">
                <div>
                  <p className="text-2xl font-bold">Premium Möbelkollektion</p>
                  <p className="text-sm mt-2 opacity-80">Hochwertige Bilder werden hier angezeigt</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Kategorien</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { name: t('category.living_room'), slug: 'wohnzimmer' },
                { name: t('category.bedroom'), slug: 'schlafzimmer' },
                { name: t('category.dining_room'), slug: 'esszimmer' },
                { name: t('category.office'), slug: 'buero' },
                { name: t('category.outdoor'), slug: 'outdoor' },
              ].map((category) => (
                <Link key={category.slug} href={`/catalog?category=${category.slug}`}>
                  <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <div className="text-2xl">🛋️</div>
                    </div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-card border-y border-border">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Truck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Kostenloser Versand</h3>
                <p className="text-sm text-muted-foreground">Ab 500 EUR versandkostenfrei in Österreich</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Qualitätsgarantie</h3>
                <p className="text-sm text-muted-foreground">30 Tage Rückgaberecht, 5 Jahre Garantie</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Nachhaltig</h3>
                <p className="text-sm text-muted-foreground">Umweltfreundliche Materialien und Produktion</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Kostenlose Beratung</h3>
                <p className="text-sm text-muted-foreground">Persönliche Designerberatung verfügbar</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Bereit für Ihre neue Einrichtung?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Entdecken Sie unsere exklusive Kollektion und finden Sie die perfekten Möbel für Ihren Raum.
            </p>
            <Link href="/catalog">
              <Button size="lg" className="gap-2">
                Jetzt einkaufen <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
