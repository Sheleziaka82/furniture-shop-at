import { useComparison } from '@/contexts/ComparisonContext';
import { Link } from 'wouter';
import { Scale } from 'lucide-react';

export function ComparisonIndicator() {
  const { products } = useComparison();

  if (products.length === 0) {
    return null;
  }

  return (
    <Link href="/comparison">
      <div className="relative cursor-pointer group">
        <Scale className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center group-hover:bg-primary/80 transition-colors">
          {products.length}
        </span>
      </div>
    </Link>
  );
}
