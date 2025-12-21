import { useComparison, ComparisonProduct } from '@/contexts/ComparisonContext';
import { Button } from '@/components/ui/button';
import { Scale, X } from 'lucide-react';
import { toast } from 'sonner';

interface ComparisonButtonProps {
  product: ComparisonProduct;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ComparisonButton({
  product,
  variant = 'outline',
  size = 'default',
  showLabel = true,
  className = '',
}: ComparisonButtonProps) {
  const { addProduct, removeProduct, isComparing, maxProducts, products } = useComparison();

  const isInComparison = isComparing(product.id);
  const isFull = products.length >= maxProducts && !isInComparison;

  const handleClick = () => {
    if (isInComparison) {
      removeProduct(product.id);
      toast.success('Aus Vergleich entfernt');
    } else {
      if (isFull) {
        toast.error(`Maximal ${maxProducts} Produkte können verglichen werden`);
        return;
      }
      addProduct(product);
      toast.success('Zum Vergleich hinzugefügt');
    }
  };

  return (
    <Button
      variant={isInComparison ? 'default' : variant}
      size={size}
      onClick={handleClick}
      disabled={isFull}
      className={`gap-2 ${className}`}
      title={
        isInComparison
          ? 'Aus Vergleich entfernen'
          : isFull
          ? `Maximal ${maxProducts} Produkte`
          : 'Zum Vergleich hinzufügen'
      }
    >
      {isInComparison ? (
        <>
          <X className="w-4 h-4" />
          {showLabel && 'Entfernen'}
        </>
      ) : (
        <>
          <Scale className="w-4 h-4" />
          {showLabel && 'Vergleichen'}
        </>
      )}
    </Button>
  );
}
