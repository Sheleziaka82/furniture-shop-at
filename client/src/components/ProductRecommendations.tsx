import { Button } from '@/components/ui/button';
import { Star, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  discount?: number;
}

interface ProductRecommendationsProps {
  title: string;
  description?: string;
  products: Product[];
  variant?: 'frequently-bought' | 'personalized' | 'similar';
}

export function ProductRecommendations({
  title,
  description,
  products,
  variant = 'personalized',
}: ProductRecommendationsProps) {
  return (
    <div className="py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
              {/* Image */}
              <div className="relative aspect-square bg-muted overflow-hidden group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {product.discount && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discount}%
                  </div>
                )}
                {variant === 'frequently-bought' && (
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                    Oft zusammen gekauft
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-sm line-clamp-2 mb-3">{product.name}</h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <p className="text-lg font-bold text-primary">
                    {(product.price / 100).toFixed(2)} EUR
                  </p>
                </div>

                {/* Button */}
                <Button size="sm" className="w-full gap-2 mt-auto">
                  <ShoppingCart className="w-4 h-4" />
                  In den Warenkorb
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
