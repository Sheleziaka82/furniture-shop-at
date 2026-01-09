import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Trash2, Package } from 'lucide-react';

export function AdminProductsList() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const { data: productsData, isLoading, refetch } = trpc.products.getAll.useQuery();
  const { data: categories } = trpc.categories.getAll.useQuery();
  
  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditDialogOpen(false);
      alert('Produkt erfolgreich aktualisiert');
    },
    onError: (error) => {
      alert('Fehler beim Aktualisieren: ' + error.message);
    },
  });
  
  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      refetch();
      alert('Produkt erfolgreich gelöscht');
    },
    onError: (error) => {
      alert('Fehler beim Löschen: ' + error.message);
    },
  });
  
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    const formData = new FormData(e.currentTarget);
    
    updateMutation.mutate({
      id: selectedProduct.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      categoryId: Number(formData.get('categoryId')),
      price: Number(formData.get('price')),
      discount: Number(formData.get('discount') || 0),
      material: formData.get('material') as string,
      color: formData.get('color') as string,
      stock: Number(formData.get('stock') || 0),
    });
  };
  
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Möchten Sie das Produkt "${name}" wirklich löschen?`)) {
      deleteMutation.mutate({ id });
    }
  };
  
  const formatPrice = (priceInCents: number) => {
    return `€${(priceInCents / 100).toFixed(2)}`;
  };
  
  if (isLoading) {
    return <div className="text-center py-8">Produkte werden geladen...</div>;
  }
  
  const products = productsData?.products || [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Produkte verwalten</h2>
        <div className="text-sm text-muted-foreground">
          Gesamt: {products.length} Produkte
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: any) => {
          const category = categories?.find((c) => c.id === product.categoryId);
          
          return (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{product.name}</h3>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(product.id, product.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
                  <span className="text-muted-foreground">Lager: {product.stock}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Kategorie: {category?.name || 'Unbekannt'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Keine Produkte gefunden. Fügen Sie Ihr erstes Produkt hinzu.
        </div>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Produkt bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeiten Sie "{selectedProduct?.name}"
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEdit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name *</Label>
                <Input id="edit-name" name="name" defaultValue={selectedProduct?.name} required />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Beschreibung</Label>
                <Textarea id="edit-description" name="description" defaultValue={selectedProduct?.description || ''} rows={3} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Preis (€) *</Label>
                  <Input 
                    id="edit-price" 
                    name="price" 
                    type="number" 
                    step="0.01"
                    defaultValue={selectedProduct ? (selectedProduct.price / 100).toFixed(2) : ''} 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-discount">Rabatt (%)</Label>
                  <Input 
                    id="edit-discount" 
                    name="discount" 
                    type="number" 
                    min="0" 
                    max="100"
                    defaultValue={selectedProduct?.discount || 0} 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-categoryId">Kategorie *</Label>
                <Select name="categoryId" defaultValue={selectedProduct?.categoryId?.toString()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-material">Material</Label>
                  <Input id="edit-material" name="material" defaultValue={selectedProduct?.material || ''} />
                </div>
                
                <div>
                  <Label htmlFor="edit-color">Farbe</Label>
                  <Input id="edit-color" name="color" defaultValue={selectedProduct?.color || ''} />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-stock">Lagerbestand</Label>
                <Input 
                  id="edit-stock" 
                  name="stock" 
                  type="number" 
                  min="0"
                  defaultValue={selectedProduct?.stock || 0} 
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Speichern...' : 'Speichern'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
