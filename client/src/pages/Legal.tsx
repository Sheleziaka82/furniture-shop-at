import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

type LegalPage = 'privacy' | 'terms' | 'impressum' | 'returns';

export default function Legal() {
  const { t } = useLanguage();
  const [activePage, setActivePage] = useState<LegalPage>('privacy');

  const pages = [
    { id: 'privacy', label: 'Datenschutz' },
    { id: 'terms', label: 'AGB' },
    { id: 'impressum', label: 'Impressum' },
    { id: 'returns', label: 'Rückgaberecht' },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          {/* Navigation */}
          <div className="flex gap-4 mb-12 border-b border-border overflow-x-auto">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setActivePage(page.id as LegalPage)}
                className={`px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activePage === page.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto prose dark:prose-invert">
            {activePage === 'privacy' && (
              <div>
                <h1>Datenschutzerklärung</h1>
                <p>
                  Wir, die Möbelhaus AT, nehmen den Schutz Ihrer persönlichen Daten sehr
                  ernst. Diese Datenschutzerklärung erläutert, wie wir Ihre Daten
                  erfassen, verwenden und schützen.
                </p>

                <h2>1. Datenverantwortlicher</h2>
                <p>
                  Möbelhaus AT
                  <br />
                  Beispielstraße 123
                  <br />
                  1010 Wien, Österreich
                  <br />
                  E-Mail: datenschutz@mobelhaus-at.at
                </p>

                <h2>2. Erhebung und Verwendung von Daten</h2>
                <p>
                  Wir erfassen Ihre Daten nur mit Ihrer Zustimmung und nur für die
                  Zwecke, die Sie verstehen und akzeptieren. Dies umfasst:
                </p>
                <ul>
                  <li>Kontaktinformationen (Name, E-Mail, Telefon)</li>
                  <li>Lieferadresse und Zahlungsinformationen</li>
                  <li>Browsing- und Kaufhistorie</li>
                  <li>Kommunikationspräferenzen</li>
                </ul>

                <h2>3. Datensicherheit</h2>
                <p>
                  Wir verwenden SSL-Verschlüsselung und andere Sicherheitsmaßnahmen, um
                  Ihre Daten zu schützen. Alle Zahlungsinformationen werden verschlüsselt
                  übertragen.
                </p>

                <h2>4. Ihre Rechte</h2>
                <p>Sie haben das Recht zu:</p>
                <ul>
                  <li>Ihre gespeicherten Daten einsehen</li>
                  <li>Ihre Daten berichtigen oder löschen</li>
                  <li>Der Verarbeitung widersprechen</li>
                  <li>Ihre Daten exportieren</li>
                </ul>

                <h2>5. Kontakt</h2>
                <p>
                  Für Datenschutzfragen kontaktieren Sie uns unter
                  datenschutz@mobelhaus-at.at
                </p>
              </div>
            )}

            {activePage === 'terms' && (
              <div>
                <h1>Allgemeine Geschäftsbedingungen</h1>
                <p>
                  Diese Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung unserer
                  Website und den Kauf von Produkten.
                </p>

                <h2>1. Geltungsbereich</h2>
                <p>
                  Diese AGB gelten für alle Verträge zwischen Ihnen und Möbelhaus AT über
                  die Nutzung unserer Website und den Kauf von Produkten.
                </p>

                <h2>2. Vertragsschluss</h2>
                <p>
                  Der Vertrag kommt zustande, wenn Sie eine Bestellung aufgeben und wir
                  diese bestätigen. Die Bestätigung erfolgt per E-Mail.
                </p>

                <h2>3. Preise und Zahlungsbedingungen</h2>
                <ul>
                  <li>Alle Preise sind in EUR und inkl. MwSt.</li>
                  <li>Zahlung ist per Kreditkarte, PayPal oder Banküberweisung möglich</li>
                  <li>Versandkosten werden separat berechnet</li>
                </ul>

                <h2>4. Lieferung</h2>
                <p>
                  Wir versenden innerhalb von 1-2 Werktagen nach Bestellbestätigung.
                  Lieferzeiten betragen 5-7 Werktage (Standard) oder 2-3 Werktage
                  (Express).
                </p>

                <h2>5. Rückgaberecht</h2>
                <p>
                  Sie haben das Recht, Ihre Bestellung innerhalb von 30 Tagen ohne
                  Angabe von Gründen zurückzugeben.
                </p>
              </div>
            )}

            {activePage === 'impressum' && (
              <div>
                <h1>Impressum</h1>

                <h2>Betreiber der Website</h2>
                <p>
                  Möbelhaus AT GmbH
                  <br />
                  Beispielstraße 123
                  <br />
                  1010 Wien, Österreich
                </p>

                <h2>Kontakt</h2>
                <p>
                  Telefon: +43 (0) 1 234 5678
                  <br />
                  E-Mail: info@mobelhaus-at.at
                  <br />
                  Website: www.mobelhaus-at.at
                </p>

                <h2>Geschäftsführer</h2>
                <p>Max Mustermann</p>

                <h2>Registereintrag</h2>
                <p>
                  Firmenbuch-Nr.: FN 123456a
                  <br />
                  Gerichtsstand: Handelsgericht Wien
                </p>

                <h2>Umsatzsteuer-ID</h2>
                <p>ATU12345678</p>

                <h2>Haftungsausschluss</h2>
                <p>
                  Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung
                  für die Inhalte externer Links. Für den Inhalt verlinkter Seiten sind
                  ausschließlich deren Betreiber verantwortlich.
                </p>
              </div>
            )}

            {activePage === 'returns' && (
              <div>
                <h1>Rückgaberecht und Widerrufsrecht</h1>

                <h2>Widerrufsrecht</h2>
                <p>
                  Sie haben das Recht, Ihre Bestellung innerhalb von 14 Tagen ohne Angabe
                  von Gründen zu widerrufen. Die Frist beginnt mit dem Erhalt der Ware.
                </p>

                <h2>Wie Sie Ihr Widerrufsrecht ausüben</h2>
                <p>
                  Um Ihr Widerrufsrecht auszuüben, müssen Sie uns eine eindeutige
                  Erklärung Ihres Widerrufs mitteilen. Sie können dies tun durch:
                </p>
                <ul>
                  <li>E-Mail an: widerrufs@mobelhaus-at.at</li>
                  <li>Telefon: +43 (0) 1 234 5678</li>
                  <li>Schriftlich an unsere Adresse</li>
                </ul>

                <h2>Rückgabeprozess</h2>
                <p>
                  Nach Erhalt Ihres Widerrufs werden wir Ihnen Anweisungen zur Rückgabe
                  der Ware geben. Die Kosten für die Rückgabe trägt der Käufer, es sei
                  denn, die Ware ist fehlerhaft.
                </p>

                <h2>Rückerstattung</h2>
                <p>
                  Wir werden Ihre Zahlung innerhalb von 14 Tagen nach Erhalt der
                  zurückgesendeten Ware erstatten. Die Rückerstattung erfolgt auf die
                  gleiche Zahlungsart, die Sie verwendet haben.
                </p>

                <h2>Ausnahmen</h2>
                <p>
                  Das Widerrufsrecht gilt nicht für maßgefertigte oder personalisierte
                  Produkte sowie für Produkte, die nach Lieferung beschädigt oder
                  verschmutzt wurden.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
