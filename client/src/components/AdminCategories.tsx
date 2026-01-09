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
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';

export function AdminCategories() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  const { data: allCategories, isLoading, refetch } = trpc.categories.getAll.useQuery();
  const { data: mainCategories } = trpc.categories.getMain.useQuery();
  
  const createMutation = trpc.categories.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateDialogOpen(false);
    },
  });
  
  const updateMutation = trpc.categories.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditDialogOpen(false);
    },
  });
  
  const deleteMutation = trpc.categories.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const parentId = formData.get('parentId') as string;
    
    createMutation.mutate({
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      parentId: parentId && parentId !== 'null' ? Number(parentId) : null,
      displayOrder: Number(formData.get('displayOrder') || 0),
    });
  };
  
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCategory) return;
    
    const formData = new FormData(e.currentTarget);
    const parentId = formData.get('parentId') as string;
    
    updateMutation.mutate({
      id: selectedCategory.id,
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      parentId: parentId && parentId !== 'null' ? Number(parentId) : null,
      displayOrder: Number(formData.get('displayOrder') || 0),
    });
  };
  
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Möchten Sie die Kategorie "${name}" wirklich löschen?`)) {
      deleteMutation.mutate({ id });
    }
  };
  
  // Group categories by parent
  const categoryTree = allCategories?.reduce((acc: any, cat: any) => {
    if (!cat.parentId) {
      acc[cat.id] = { ...cat, children: [] };
    }
    return acc;
  }, {});
  
  allCategories?.forEach((cat: any) => {
    if (cat.parentId && categoryTree[cat.parentId]) {
      categoryTree[cat.parentId].children.push(cat);
    }
  });
  
  if (isLoading) {
    return <div className="text-center py-8">Kategorien werden geladen...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kategorien verwalten</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Neue Kategorie
        </Button>
      </div>
      
      <div className="space-y-4">
        {Object.values(categoryTree || {}).map((mainCat: any) => (
          <div key={mainCat.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">{mainCat.name}</h3>
                <span className="text-sm text-muted-foreground">({mainCat.slug})</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory(mainCat);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(mainCat.id, mainCat.name)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {mainCat.description && (
              <p className="text-sm text-muted-foreground mb-3">{mainCat.description}</p>
            )}
            
            {mainCat.children.length > 0 && (
              <div className="ml-6 space-y-2 mt-3 border-l-2 border-border pl-4">
                {mainCat.children.map((subCat: any) => (
                  <div key={subCat.id} className="flex items-center justify-between py-2">
                    <div>
                      <span className="font-medium">{subCat.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">({subCat.slug})</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedCategory(subCat);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(subCat.id, subCat.name)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Kategorie erstellen</DialogTitle>
            <DialogDescription>
              Erstellen Sie eine neue Haupt- oder Unterkategorie
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" required />
              </div>
              
              <div>
                <Label htmlFor="slug">Slug * (URL-freundlich)</Label>
                <Input id="slug" name="slug" required placeholder="z.B. badezimmer" />
              </div>
              
              <div>
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>
              
              <div>
                <Label htmlFor="parentId">Übergeordnete Kategorie</Label>
                <Select name="parentId" defaultValue="null">
                  <SelectTrigger>
                    <SelectValue placeholder="Hauptkategorie (keine Übergeordnete)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Hauptkategorie</SelectItem>
                    {mainCategories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="displayOrder">Anzeigereihenfolge</Label>
                <Input id="displayOrder" name="displayOrder" type="number" defaultValue={0} />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Erstellen...' : 'Erstellen'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategorie bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeiten Sie die Kategorie "{selectedCategory?.name}"
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEdit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name *</Label>
                <Input id="edit-name" name="name" defaultValue={selectedCategory?.name} required />
              </div>
              
              <div>
                <Label htmlFor="edit-slug">Slug *</Label>
                <Input id="edit-slug" name="slug" defaultValue={selectedCategory?.slug} required />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Beschreibung</Label>
                <Textarea id="edit-description" name="description" defaultValue={selectedCategory?.description || ''} rows={3} />
              </div>
              
              <div>
                <Label htmlFor="edit-parentId">Übergeordnete Kategorie</Label>
                <Select name="parentId" defaultValue={selectedCategory?.parentId?.toString() || 'null'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Hauptkategorie</SelectItem>
                    {mainCategories?.filter((cat) => cat.id !== selectedCategory?.id).map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-displayOrder">Anzeigereihenfolge</Label>
                <Input id="edit-displayOrder" name="displayOrder" type="number" defaultValue={selectedCategory?.displayOrder || 0} />
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
