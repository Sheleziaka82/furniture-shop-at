import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Check } from 'lucide-react';
import { toast } from 'sonner';

interface NewsletterSignupProps {
  variant?: 'inline' | 'card' | 'footer';
  title?: string;
  description?: string;
}

export function NewsletterSignup({
  variant = 'inline',
  title = 'Bleiben Sie auf dem Laufenden',
  description = 'Erhalten Sie exklusive Angebote und Neuigkeiten direkt in Ihren Posteingang',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Bitte geben Sie Ihre E-Mail-Adresse ein');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      toast.success('Vielen Dank für Ihr Abonnement!');
      setEmail('');
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'card') {
    return (
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-8 text-center">
        <Mail className="w-12 h-12 mx-auto mb-4 opacity-80" />
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="mb-6 opacity-90">{description}</p>

        {!isSubscribed ? (
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Ihre E-Mail-Adresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button
              type="submit"
              variant="secondary"
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              {isLoading ? 'Wird abgesendet...' : 'Abonnieren'}
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 text-white">
            <Check className="w-5 h-5" />
            <span>Erfolgreich abonniert!</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div>
        <h3 className="font-semibold mb-4">{title}</h3>
        {!isSubscribed ? (
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Ihre E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              {isLoading ? '...' : 'OK'}
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Check className="w-4 h-4" />
            <span>Danke für Ihr Abonnement!</span>
          </div>
        )}
      </div>
    );
  }

  // Default inline variant
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex gap-4 items-center">
        <Mail className="w-8 h-8 text-primary flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {!isSubscribed ? (
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" disabled={isLoading} className="whitespace-nowrap">
              {isLoading ? '...' : 'Abonnieren'}
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <Check className="w-5 h-5" />
            <span>Abonniert!</span>
          </div>
        )}
      </div>
    </div>
  );
}
