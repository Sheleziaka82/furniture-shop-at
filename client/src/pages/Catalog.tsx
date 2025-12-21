import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { Grid3x3, List } from 'lucide-react';
import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';

type ViewMode = 'grid' | 'list';
type SortBy = 'popularity' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

export default function Catalog() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('popularity');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedFilters, setSelectedFilters] = useState({
    colors: [] as string[],
    materials: [] as string[],
    styles: [] as string[],
  });

  // Get category from URL
  const params = new URLSearchParams(location.split('?')[1] || '');
  const categorySlug = params.get('category');

  // Fetch categories
  const { data: categories } = trpc.products.getCategories.useQuery();

  // Find category ID from slug
  const categoryId = useMemo(() => {
    if (!categorySlug || !categories) return null;
    const category = categories.find((c) => c.slug === categorySlug);
    return category?.id || null;
  }, [categorySlug, categories]);

  // Using mock data for demo (replace with API data when ready)
  const isLoading = false;

  // Mock product data for demo (replace with API data)
  const mockProducts = [
    {
      id: 1,
      name: 'Modernes Sofa',
      price: 1299,
      color: 'Grau',
      material: 'Stoff',
      style: 'Modern',
      image: 'https://via.placeholder.com/300x300?text=Sofa',
      rating: 4.5,
      reviews: 24,
      isBestseller: true,
      isNew: false,
      discount: 0,
    },
    {
      id: 2,
      name: 'Klassischer Sessel',
      price: 599,
      color: 'Beige',
      material: 'Leder',
      style: 'Klassisch',
      image: 'https://via.placeholder.com/300x300?text=Sessel',
      rating: 4.8,
      reviews: 42,
      isBestseller: false,
      isNew: true,
      discount: 10,
    },
    {
      id: 3,
      name: 'Skandinavischer Tisch',
      price: 399,
      color: 'Natur',
      material: 'Holz',
      style: 'Skandinavisch',
      image: 'https://via.placeholder.com/300x300?text=Tisch',
      rating: 4.6,
      reviews: 18,
      isBestseller: true,
      isNew: false,
      discount: 15,
    },
    {
      id: 4,
      name: 'Industrial Regal',
      price: 299,
      color: 'Schwarz',
      material: 'Metall',
      style: 'Industrial',
      image: 'https://via.placeholder.com/300x300?text=Regal',
      rating: 4.3,
      reviews: 12,
      isBestseller: false,
      isNew: false,
      discount: 0,
    },
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = mockProducts;

    // Price filter
    products = products.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Color filter
    if (selectedFilters.colors.length > 0) {
      products = products.filter((p) =>
        selectedFilters.colors.includes(p.color)
      );
    }

    // Material filter
    if (selectedFilters.materials.length > 0) {
      products = products.filter((p) =>
        selectedFilters.materials.includes(p.material)
      );
    }

    // Style filter
    if (selectedFilters.styles.length > 0) {
      products = products.filter((p) =>
        selectedFilters.styles.includes(p.style)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        products.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return products;
  }, [selectedFilters, priceRange, sortBy]);

  const toggleFilter = (filterType: 'colors' | 'materials' | 'styles', value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((v) => v !== value)
        : [...prev[filterType], value],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-4xl font-bold mb-8">{t('nav.catalog')}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                {/* Price Filter */}
                <div>
                  <h3 className="font-semibold mb-4">{t('common.price')}</h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground">
                      {priceRange[0]} EUR - {priceRange[1]} EUR
                    </div>
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <h3 className="font-semibold mb-4">{t('product.color')}</h3>
                  <div className="space-y-2">
                    {['Grau', 'Beige', 'Natur', 'Schwarz'].map((color) => (
                      <label key={color} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.colors.includes(color)}
                          onChange={() => toggleFilter('colors', color)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Material Filter */}
                <div>
                  <h3 className="font-semibold mb-4">{t('product.material')}</h3>
                  <div className="space-y-2">
                    {['Stoff', 'Leder', 'Holz', 'Metall'].map((material) => (
                      <label key={material} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.materials.includes(material)}
                          onChange={() => toggleFilter('materials', material)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{material}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Style Filter */}
                <div>
                  <h3 className="font-semibold mb-4">Stil</h3>
                  <div className="space-y-2">
                    {['Modern', 'Klassisch', 'Skandinavisch', 'Industrial'].map((style) => (
                      <label key={style} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.styles.includes(style)}
                          onChange={() => toggleFilter('styles', style)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedFilters({ colors: [], materials: [], styles: [] });
                    setPriceRange([0, 10000]);
                  }}
                >
                  Filter zurücksetzen
                </Button>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} Produkte gefunden
                </p>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{t('common.sort')}:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="popularity">Beliebtheit</option>
                      <option value="price-asc">Preis: Niedrig zu Hoch</option>
                      <option value="price-desc">Preis: Hoch zu Niedrig</option>
                      <option value="newest">Neueste</option>
                      <option value="rating">Bewertung</option>
                    </select>
                  </div>

                  {/* View Mode */}
                  <div className="flex gap-2 border border-border rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Grid3x3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Keine Produkte gefunden. Versuchen Sie, Ihre Filter zu ändern.
                </div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {filteredProducts.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`}>
                      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                        {/* Image */}
                        <div className="relative aspect-square bg-muted overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                          {product.isBestseller && (
                            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                              {t('product.bestseller')}
                            </div>
                          )}
                          {product.isNew && (
                            <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                              {t('product.new')}
                            </div>
                          )}
                          {product.discount > 0 && (
                            <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              -{product.discount}%
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < Math.floor(product.rating)
                                      ? 'text-yellow-400'
                                      : 'text-muted'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({product.reviews})
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-bold text-primary">
                              {product.price} EUR
                            </span>
                            {product.discount > 0 && (
                              <span className="text-sm text-muted-foreground line-through">
                                {Math.round(product.price / (1 - product.discount / 100))} EUR
                              </span>
                            )}
                          </div>

                          {/* Button */}
                          <Button className="w-full">{t('common.add_to_cart')}</Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
