import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Moon, Sun, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';
import { getLoginUrl } from '@/const';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { items: cartItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            F
          </div>
          <span className="hidden sm:inline text-primary">Möbelhaus</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            {t('nav.home')}
          </Link>
          <Link href="/catalog" className="text-foreground hover:text-primary transition-colors">
            {t('nav.catalog')}
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            {t('nav.about')}
          </Link>
          <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
            {t('nav.contact')}
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-2 border border-border rounded-lg p-1">
            <button
              onClick={() => setLanguage('de-AT')}
              className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                language === 'de-AT'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              DE
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                language === 'en'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account / Login */}
          {isAuthenticated ? (
            <Link href="/account" className="hidden sm:block">
              <Button variant="outline" size="sm">
                {t('nav.account')}
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()} className="hidden sm:block">
              <Button size="sm">
                {t('nav.login')}
              </Button>
            </a>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container py-4 flex flex-col gap-4">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/catalog" className="text-foreground hover:text-primary transition-colors">
              {t('nav.catalog')}
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              {t('nav.about')}
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              {t('nav.contact')}
            </Link>
            <div className="border-t border-border pt-4">
              {isAuthenticated ? (
                <Link href="/account">
                  <Button variant="outline" className="w-full">
                    {t('nav.account')}
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()} className="block">
                  <Button className="w-full">
                    {t('nav.login')}
                  </Button>
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
