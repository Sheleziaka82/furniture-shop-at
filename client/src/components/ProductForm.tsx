import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  material: string;
  color: string;
  width: number;
  height: number;
  depth: number;
  weight: number;
  stock: number;
  images: string[];
}



const MATERIALS = [
  { value: 'wood', label: 'Holz' },
  { value: 'leather', label: 'Leder' },
  { value: 'fabric', label: 'Stoff' },
  { value: 'metal', label: 'Metall' },
  { value: 'glass', label: 'Glas' },
  { value: 'mixed', label: 'Gemischt' },
];

const COLORS = [
  { value: 'black', label: 'Schwarz' },
  { value: 'white', label: 'Weiß' },
  { value: 'gray', label: 'Grau' },
  { value: 'brown', label: 'Braun' },
  { value: 'beige', label: 'Beige' },
  { value: 'red', label: 'Rot' },
  { value: 'blue', label: 'Blau' },
  { value: 'green', label: 'Grün' },
  { value: 'natural', label: 'Natur' },
];

export function ProductForm({ onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.getAll.useQuery();
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    price: 0,
    discount: 0,
    material: '',
    color: '',
    width: 0,
    height: 0,
    depth: 0,
    weight: 0,
    stock: 0,
    images: [],
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('price') || name.includes('discount') || name.includes('width') || name.includes('height') || name.includes('depth') || name.includes('weight') || name.includes('stock') ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setImageUrls((prev) => [...prev, imageInput]);
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (!formData.name.trim()) {
      toast.error('Produktname ist erforderlich');
      return;
    }

    if (!formData.category) {
      toast.error('Kategorie ist erforderlich');
      return;
    }

    if (formData.price <= 0) {
      toast.error('Preis muss größer als 0 sein');
      return;
    }

    if (formData.stock < 0) {
      toast.error('Lagerbestand kann nicht negativ sein');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        images: imageUrls,
      });
      toast.success('Produkt erfolgreich hinzugefügt');
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        price: 0,
        discount: 0,
        material: '',
        color: '',
        width: 0,
        height: 0,
        depth: 0,
        weight: 0,
        stock: 0,
        images: [],
      });
      setImageUrls([]);
    } catch (error) {
      toast.error('Fehler beim Hinzufügen des Produkts');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neues Produkt hinzufügen</CardTitle>
        <CardDescription>Füllen Sie alle erforderlichen Felder aus</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grundinformationen */}
          <div className="space-y-4">
            <h3 className="font-semibold">Grundinformationen</h3>

            <div>
              <Label htmlFor="name">Produktname *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="z.B. Modernes Ledersofa"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detaillierte Produktbeschreibung..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Kategorie *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen Sie eine Kategorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled>Laden...</SelectItem>
                    ) : (
                      categories?.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.parentId ? `  ↳ ${cat.name}` : cat.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="material">Material</Label>
                <Select value={formData.material} onValueChange={(value) => handleSelectChange('material', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen Sie ein Material" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIALS.map((mat) => (
                      <SelectItem key={mat.value} value={mat.value}>
                        {mat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="color">Farbe</Label>
              <Select value={formData.color} onValueChange={(value) => handleSelectChange('color', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie eine Farbe" />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((col) => (
                    <SelectItem key={col.value} value={col.value}>
                      {col.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preise */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Preise</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preis (EUR) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="99.99"
                  required
                />
              </div>

              <div>
                <Label htmlFor="discount">Rabatt (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Abmessungen */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Abmessungen & Gewicht</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="width">Breite (cm)</Label>
                <Input
                  id="width"
                  name="width"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.width}
                  onChange={handleInputChange}
                  placeholder="100"
                />
              </div>

              <div>
                <Label htmlFor="height">Höhe (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="80"
                />
              </div>

              <div>
                <Label htmlFor="depth">Tiefe (cm)</Label>
                <Input
                  id="depth"
                  name="depth"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.depth}
                  onChange={handleInputChange}
                  placeholder="60"
                />
              </div>

              <div>
                <Label htmlFor="weight">Gewicht (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="50"
                />
              </div>
            </div>
          </div>

          {/* Lagerbestand */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Lagerbestand</h3>

            <div>
              <Label htmlFor="stock">Verfügbare Menge *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                step="1"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="10"
                required
              />
            </div>
          </div>

          {/* Bilder */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Produktbilder</h3>

            <div className="flex gap-2">
              <Input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Bild-URL eingeben"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddImage}>
                Hinzufügen
              </Button>
            </div>

            {imageUrls.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {imageUrls.length} Bild{imageUrls.length !== 1 ? 'er' : ''} hinzugefügt
                </p>
                <div className="space-y-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-3 rounded">
                      <span className="text-sm truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 border-t pt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Wird gespeichert...' : 'Produkt hinzufügen'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
