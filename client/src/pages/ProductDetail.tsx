import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Link, useParams } from 'wouter';
import { Heart, Share2, Truck, Shield, RotateCcw, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const params = useParams();
  const productId = parseInt(params.id || '0');

  // Mock product data
  const product = {
    id: productId,
    name: 'Modernes Sofa Premium',
    price: 1299,
    originalPrice: 1599,
    rating: 4.5,
    reviews: 24,
    description: 'Ein luxuriöses, modernes Sofa mit hochwertigen Materialien und ergonomischem Design. Perfekt für jeden modernen Wohnraum.',
    material: 'Hochwertiger Stoff',
    dimensions: '220 x 90 x 85 cm',
    weight: '65 kg',
    color: 'Grau',
    style: 'Modern',
    stock: 12,
    isBestseller: true,
    isNew: false,
    images: [
      'https://via.placeholder.com/600x600?text=Sofa+Front',
      'https://via.placeholder.com/600x600?text=Sofa+Side',
      'https://via.placeholder.com/600x600?text=Sofa+Detail',
      'https://via.placeholder.com/600x600?text=Sofa+Room',
    ],
    variants: [
      { id: 1, color: 'Grau', colorCode: '#808080', stock: 12 },
      { id: 2, color: 'Beige', colorCode: '#F5F5DC', stock: 8 },
      { id: 3, color: 'Dunkelgrau', colorCode: '#404040', stock: 5 },
    ],
    reviews_data: [
      { author: 'Maria K.', rating: 5, text: 'Sehr gutes Sofa, sehr bequem!', verified: true },
      { author: 'Hans M.', rating: 4, text: 'Gute Qualität, schnelle Lieferung', verified: true },
    ],
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      variantId: selectedVariant.id,
      variantColor: selectedVariant.color,
      imageUrl: product.images[0],
    });
    toast.success(`${product.name} wurde zum Warenkorb hinzugefügt!`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">
              {t('nav.home')}
            </Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-primary">
              {t('nav.catalog')}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="mb-4 bg-muted rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Header */}
              <div className="mb-6">
                {product.isBestseller && (
                  <div className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold mb-3">
                    {t('product.bestseller')}
                  </div>
                )}
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews} {t('product.reviews')})
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-primary">{product.price} EUR</span>
                  {product.originalPrice > product.price && (
                    <span className="text-2xl text-muted-foreground line-through">
                      {product.originalPrice} EUR
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-8">{product.description}</p>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('product.material')}</p>
                  <p className="font-semibold">{product.material}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('product.dimensions')}</p>
                  <p className="font-semibold">{product.dimensions}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('product.weight')}</p>
                  <p className="font-semibold">{product.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('product.stock')}</p>
                  <p className="font-semibold">
                    {product.stock > 0 ? (
                      <span className="text-green-600">{t('product.in_stock')}</span>
                    ) : (
                      <span className="text-red-600">{t('product.out_of_stock')}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Color Variants */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">{t('product.color')}</h3>
                <div className="flex gap-4">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-12 h-12 rounded-lg border-2 transition-colors ${
                        selectedVariant.id === variant.id
                          ? 'border-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                      style={{ backgroundColor: variant.colorCode }}
                      title={variant.color}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{selectedVariant.color}</p>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">{t('cart.quantity')}</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {t('common.add_to_cart')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
                  />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 pb-8 border-b border-border">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-sm">Kostenloser Versand ab 500 EUR</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  <span className="text-sm">30 Tage Rückgaberecht</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm">5 Jahre Garantie</span>
                </div>
              </div>

              {/* Reviews Preview */}
              <div className="mt-8">
                <h3 className="font-semibold mb-4">{t('product.reviews')}</h3>
                <div className="space-y-4">
                  {product.reviews_data.map((review, index) => (
                    <div key={index} className="border-b border-border pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{review.author}</p>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.text}</p>
                      {review.verified && (
                        <p className="text-xs text-green-600 mt-2">✓ Verifizierter Kauf</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <section className="mt-16 pt-16 border-t border-border">
            <h2 className="text-3xl font-bold mb-8">{t('product.related')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Link key={i} href={`/product/${i}`}>
                  <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <img
                        src={`https://via.placeholder.com/300x300?text=Product+${i}`}
                        alt={`Related Product ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">Ähnliches Produkt {i}</h3>
                      <p className="text-lg font-bold text-primary">299 EUR</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
