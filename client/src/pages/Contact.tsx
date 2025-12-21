import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Kontaktieren Sie uns</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Haben Sie Fragen zu unseren Produkten oder Dienstleistungen? Wir sind hier,
              um Ihnen zu helfen.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Address */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Adresse</h3>
                    <p className="text-muted-foreground text-sm">
                      Beispielstraße 123
                      <br />
                      1010 Wien, Österreich
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Telefon</h3>
                    <p className="text-muted-foreground text-sm">
                      <a
                        href="tel:+43123456789"
                        className="hover:text-primary transition-colors"
                      >
                        +43 (0) 1 234 5678
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">E-Mail</h3>
                    <p className="text-muted-foreground text-sm">
                      <a
                        href="mailto:info@mobelhaus-at.at"
                        className="hover:text-primary transition-colors"
                      >
                        info@mobelhaus-at.at
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Öffnungszeiten</h3>
                    <p className="text-muted-foreground text-sm">
                      Mo–Fr: 9:00–18:00
                      <br />
                      Sa: 10:00–16:00
                      <br />
                      So: Geschlossen
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Senden Sie uns eine Nachricht</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ihr Name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">E-Mail</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ihre E-Mail-Adresse"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Betreff</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">-- Bitte wählen Sie --</option>
                      <option value="product">Produktanfrage</option>
                      <option value="order">Bestellanfrage</option>
                      <option value="delivery">Lieferproblem</option>
                      <option value="return">Rückgabe</option>
                      <option value="other">Sonstiges</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nachricht</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ihre Nachricht..."
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-8">Häufig gestellte Fragen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">Wie kann ich meine Bestellung verfolgen?</h3>
                <p className="text-muted-foreground text-sm">
                  Sie erhalten eine Tracking-Nummer per E-Mail, sobald Ihre Bestellung
                  versendet wird. Sie können diese Nummer verwenden, um Ihre Lieferung
                  zu verfolgen.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Wie lange dauert die Lieferung?</h3>
                <p className="text-muted-foreground text-sm">
                  Standardversand dauert 5-7 Werktage. Expressversand ist in 2-3 Werktagen
                  verfügbar. Die genaue Lieferzeit wird beim Checkout angezeigt.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Kann ich meine Bestellung ändern?</h3>
                <p className="text-muted-foreground text-sm">
                  Ja, Sie können Ihre Bestellung ändern, solange sie noch nicht versendet
                  wurde. Kontaktieren Sie uns schnellstmöglich mit Ihrer Bestellnummer.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Wie funktioniert die Rückgabe?</h3>
                <p className="text-muted-foreground text-sm">
                  Sie können Produkte innerhalb von 30 Tagen zurückgeben. Kontaktieren Sie
                  uns, und wir senden Ihnen ein Rückgabeetikett per E-Mail.
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
