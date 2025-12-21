import React, { createContext, useContext, useState } from 'react';

type Language = 'de-AT' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  'de-AT': {
    // Header & Navigation
    'nav.home': 'Startseite',
    'nav.catalog': 'Katalog',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    'nav.account': 'Mein Konto',
    'nav.orders': 'Bestellungen',
    'nav.wishlist': 'Wunschliste',
    'nav.cart': 'Warenkorb',
    'nav.admin': 'Admin-Panel',
    'nav.logout': 'Abmelden',
    'nav.login': 'Anmelden',

    // Theme & Language
    'theme.light': 'Hell',
    'theme.dark': 'Dunkel',
    'lang.german': 'Deutsch',
    'lang.english': 'English',

    // Common
    'common.price': 'Preis',
    'common.add_to_cart': 'In den Warenkorb',
    'common.buy_now': 'Jetzt kaufen',
    'common.add_to_wishlist': 'Zur Wunschliste hinzufügen',
    'common.remove': 'Entfernen',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.sort': 'Sortieren',
    'common.view': 'Ansicht',
    'common.grid': 'Gitter',
    'common.list': 'Liste',
    'common.loading': 'Wird geladen...',
    'common.error': 'Ein Fehler ist aufgetreten',
    'common.success': 'Erfolgreich',

    // Products
    'product.details': 'Produktdetails',
    'product.description': 'Beschreibung',
    'product.specifications': 'Spezifikationen',
    'product.material': 'Material',
    'product.color': 'Farbe',
    'product.dimensions': 'Abmessungen',
    'product.weight': 'Gewicht',
    'product.stock': 'Lagerbestand',
    'product.in_stock': 'Verfügbar',
    'product.out_of_stock': 'Nicht verfügbar',
    'product.bestseller': 'Bestseller',
    'product.new': 'Neu',
    'product.discount': 'Rabatt',
    'product.reviews': 'Bewertungen',
    'product.rating': 'Bewertung',
    'product.related': 'Ähnliche Produkte',
    'product.frequently_bought': 'Häufig zusammen gekauft',

    // Categories
    'category.living_room': 'Wohnzimmer',
    'category.bedroom': 'Schlafzimmer',
    'category.dining_room': 'Esszimmer',
    'category.office': 'Büro',
    'category.outdoor': 'Außenbereich',

    // Cart & Checkout
    'cart.title': 'Warenkorb',
    'cart.empty': 'Ihr Warenkorb ist leer',
    'cart.continue_shopping': 'Weiter einkaufen',
    'cart.proceed_checkout': 'Zur Kasse gehen',
    'cart.quantity': 'Menge',
    'cart.subtotal': 'Zwischensumme',
    'cart.shipping': 'Versand',
    'cart.tax': 'Steuern',
    'cart.total': 'Gesamt',
    'cart.promo_code': 'Aktionscode',
    'cart.apply': 'Anwenden',

    'checkout.title': 'Kasse',
    'checkout.step1': 'Kontaktinformationen',
    'checkout.step2': 'Lieferadresse',
    'checkout.step3': 'Versandart',
    'checkout.step4': 'Zahlung',
    'checkout.step5': 'Bestätigung',
    'checkout.first_name': 'Vorname',
    'checkout.last_name': 'Nachname',
    'checkout.email': 'E-Mail',
    'checkout.phone': 'Telefon',
    'checkout.street': 'Straße',
    'checkout.postal_code': 'Postleitzahl',
    'checkout.city': 'Stadt',
    'checkout.country': 'Land',
    'checkout.shipping_method': 'Versandart',
    'checkout.payment_method': 'Zahlungsart',
    'checkout.standard_shipping': 'Standardversand',
    'checkout.express_shipping': 'Expressversand',
    'checkout.pickup': 'Abholung',
    'checkout.assembly': 'Versand & Montage',
    'checkout.credit_card': 'Kreditkarte',
    'checkout.paypal': 'PayPal',
    'checkout.klarna': 'Klarna',
    'checkout.bank_transfer': 'Banküberweisung',
    'checkout.apple_pay': 'Apple Pay',
    'checkout.google_pay': 'Google Pay',
    'checkout.place_order': 'Bestellung aufgeben',
    'checkout.order_confirmation': 'Bestellbestätigung',
    'checkout.order_number': 'Bestellnummer',
    'checkout.thank_you': 'Vielen Dank für Ihre Bestellung!',

    // Account
    'account.title': 'Mein Konto',
    'account.profile': 'Profil',
    'account.orders': 'Bestellungen',
    'account.addresses': 'Adressen',
    'account.wishlist': 'Wunschliste',
    'account.settings': 'Einstellungen',
    'account.loyalty': 'Treueprogramm',
    'account.points': 'Punkte',
    'account.order_history': 'Bestellverlauf',
    'account.order_status': 'Bestellstatus',
    'account.tracking': 'Verfolgung',

    // Admin
    'admin.title': 'Admin-Panel',
    'admin.dashboard': 'Dashboard',
    'admin.products': 'Produkte',
    'admin.categories': 'Kategorien',
    'admin.orders': 'Bestellungen',
    'admin.customers': 'Kunden',
    'admin.analytics': 'Analytik',
    'admin.settings': 'Einstellungen',
    'admin.add_product': 'Produkt hinzufügen',
    'admin.edit_product': 'Produkt bearbeiten',
    'admin.delete_product': 'Produkt löschen',
    'admin.manage_orders': 'Bestellungen verwalten',
    'admin.manage_customers': 'Kunden verwalten',

    // Footer
    'footer.about': 'Über uns',
    'footer.contact': 'Kontakt',
    'footer.privacy': 'Datenschutz',
    'footer.terms': 'Bedingungen',
    'footer.impressum': 'Impressum',
    'footer.returns': 'Rückgaben',
    'footer.newsletter': 'Newsletter',
    'footer.subscribe': 'Abonnieren',
    'footer.follow_us': 'Folgen Sie uns',
    'footer.company': 'Unternehmen',
    'footer.legal': 'Rechtliches',
    'footer.customer_service': 'Kundenservice',
  },
  'en': {
    // Header & Navigation
    'nav.home': 'Home',
    'nav.catalog': 'Catalog',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.account': 'My Account',
    'nav.orders': 'Orders',
    'nav.wishlist': 'Wishlist',
    'nav.cart': 'Cart',
    'nav.admin': 'Admin Panel',
    'nav.logout': 'Logout',
    'nav.login': 'Login',

    // Theme & Language
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'lang.german': 'Deutsch',
    'lang.english': 'English',

    // Common
    'common.price': 'Price',
    'common.add_to_cart': 'Add to Cart',
    'common.buy_now': 'Buy Now',
    'common.add_to_wishlist': 'Add to Wishlist',
    'common.remove': 'Remove',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.view': 'View',
    'common.grid': 'Grid',
    'common.list': 'List',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',

    // Products
    'product.details': 'Product Details',
    'product.description': 'Description',
    'product.specifications': 'Specifications',
    'product.material': 'Material',
    'product.color': 'Color',
    'product.dimensions': 'Dimensions',
    'product.weight': 'Weight',
    'product.stock': 'Stock',
    'product.in_stock': 'In Stock',
    'product.out_of_stock': 'Out of Stock',
    'product.bestseller': 'Bestseller',
    'product.new': 'New',
    'product.discount': 'Discount',
    'product.reviews': 'Reviews',
    'product.rating': 'Rating',
    'product.related': 'Related Products',
    'product.frequently_bought': 'Frequently Bought Together',

    // Categories
    'category.living_room': 'Living Room',
    'category.bedroom': 'Bedroom',
    'category.dining_room': 'Dining Room',
    'category.office': 'Office',
    'category.outdoor': 'Outdoor',

    // Cart & Checkout
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continue_shopping': 'Continue Shopping',
    'cart.proceed_checkout': 'Proceed to Checkout',
    'cart.quantity': 'Quantity',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.tax': 'Tax',
    'cart.total': 'Total',
    'cart.promo_code': 'Promo Code',
    'cart.apply': 'Apply',

    'checkout.title': 'Checkout',
    'checkout.step1': 'Contact Information',
    'checkout.step2': 'Delivery Address',
    'checkout.step3': 'Shipping Method',
    'checkout.step4': 'Payment',
    'checkout.step5': 'Confirmation',
    'checkout.first_name': 'First Name',
    'checkout.last_name': 'Last Name',
    'checkout.email': 'Email',
    'checkout.phone': 'Phone',
    'checkout.street': 'Street',
    'checkout.postal_code': 'Postal Code',
    'checkout.city': 'City',
    'checkout.country': 'Country',
    'checkout.shipping_method': 'Shipping Method',
    'checkout.payment_method': 'Payment Method',
    'checkout.standard_shipping': 'Standard Shipping',
    'checkout.express_shipping': 'Express Shipping',
    'checkout.pickup': 'Pickup',
    'checkout.assembly': 'Shipping & Assembly',
    'checkout.credit_card': 'Credit Card',
    'checkout.paypal': 'PayPal',
    'checkout.klarna': 'Klarna',
    'checkout.bank_transfer': 'Bank Transfer',
    'checkout.apple_pay': 'Apple Pay',
    'checkout.google_pay': 'Google Pay',
    'checkout.place_order': 'Place Order',
    'checkout.order_confirmation': 'Order Confirmation',
    'checkout.order_number': 'Order Number',
    'checkout.thank_you': 'Thank you for your order!',

    // Account
    'account.title': 'My Account',
    'account.profile': 'Profile',
    'account.orders': 'Orders',
    'account.addresses': 'Addresses',
    'account.wishlist': 'Wishlist',
    'account.settings': 'Settings',
    'account.loyalty': 'Loyalty Program',
    'account.points': 'Points',
    'account.order_history': 'Order History',
    'account.order_status': 'Order Status',
    'account.tracking': 'Tracking',

    // Admin
    'admin.title': 'Admin Panel',
    'admin.dashboard': 'Dashboard',
    'admin.products': 'Products',
    'admin.categories': 'Categories',
    'admin.orders': 'Orders',
    'admin.customers': 'Customers',
    'admin.analytics': 'Analytics',
    'admin.settings': 'Settings',
    'admin.add_product': 'Add Product',
    'admin.edit_product': 'Edit Product',
    'admin.delete_product': 'Delete Product',
    'admin.manage_orders': 'Manage Orders',
    'admin.manage_customers': 'Manage Customers',

    // Footer
    'footer.about': 'About Us',
    'footer.contact': 'Contact',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.impressum': 'Impressum',
    'footer.returns': 'Returns',
    'footer.newsletter': 'Newsletter',
    'footer.subscribe': 'Subscribe',
    'footer.follow_us': 'Follow Us',
    'footer.company': 'Company',
    'footer.legal': 'Legal',
    'footer.customer_service': 'Customer Service',
  },
};

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({
  children,
  defaultLanguage = 'de-AT',
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('language') as Language | null;
      if (stored === 'de-AT' || stored === 'en') {
        return stored;
      }
    }
    return defaultLanguage;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, defaultValue?: string): string => {
    return translations[language][key] || defaultValue || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
