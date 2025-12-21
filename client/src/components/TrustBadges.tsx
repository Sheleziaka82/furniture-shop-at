import { Shield, Award, Truck, RotateCcw, Lock } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: Lock,
      title: 'SSL Verschlüsselt',
      description: 'Sichere Zahlungen mit 256-Bit Verschlüsselung',
    },
    {
      icon: Truck,
      title: 'Schnelle Lieferung',
      description: 'Versand innerhalb von 1-2 Werktagen',
    },
    {
      icon: RotateCcw,
      title: '30 Tage Rückgabe',
      description: 'Kostenlose Rückgabe ohne Fragen',
    },
    {
      icon: Award,
      title: 'Garantie',
      description: '2 Jahre Herstellergarantie auf alle Produkte',
    },
    {
      icon: Shield,
      title: 'Käuferschutz',
      description: '100% Geld-zurück-Garantie',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.title}
            className="bg-card border border-border rounded-lg p-4 text-center hover:shadow-md transition-shadow"
          >
            <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-sm mb-1">{badge.title}</h3>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </div>
        );
      })}
    </div>
  );
}
