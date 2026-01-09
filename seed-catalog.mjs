import { storagePut } from './server/storage.ts';
import { getDb } from './server/db.ts';
import { products } from './drizzle/schema.ts';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Демо-продукты с немецкими описаниями
const demoProducts = [
  // Badezimmer - Badmöbel-Sets
  {
    name: 'Badmöbel-Set ELEGANCE 60cm',
    slug: 'badmoebel-set-elegance-60cm',
    description: 'Modernes Badmöbel-Set mit Waschtisch 60cm, LED-Spiegel und Unterschrank. Grifflose Fronten in Matt Weiß sorgen für eine zeitlose Eleganz. Inklusive hochwertiger Keramik-Waschbecken und Soft-Close-Funktion.',
    price: 349.00,
    category: 'Badezimmer',
    subcategory: 'Badmöbel-Sets',
    stock: 15,
    images: ['YrDArcq0OOw9.jpg'],
    dimensions: '60 x 46 x 52 cm (B x T x H)',
    material: 'MDF, Keramik',
    colors: ['Matt Weiß', 'Anthrazit', 'Eiche Natur'],
    features: ['LED-Beleuchtung', 'Soft-Close', 'Wasserresistent']
  },
  {
    name: 'Badmöbel-Set PREMIUM 80cm Doppelwaschbecken',
    slug: 'badmoebel-set-premium-80cm-doppel',
    description: 'Luxuriöses Badmöbel-Set mit Doppelwaschbecken 80cm, perfekt für größere Badezimmer. Mit integrierter LED-Beleuchtung und viel Stauraum. Hochwertige Verarbeitung und moderne Optik.',
    price: 599.00,
    category: 'Badezimmer',
    subcategory: 'Badmöbel-Sets',
    stock: 8,
    images: ['WJt208hLW5Ax.jpg'],
    dimensions: '80 x 50 x 55 cm (B x T x H)',
    material: 'MDF, Keramik, Glas',
    colors: ['Beige/Gold', 'Schwarz/Silber'],
    features: ['Doppelwaschbecken', 'LED-Beleuchtung', 'Viel Stauraum']
  },
  {
    name: 'Badmöbel-Set MODERN 55cm',
    slug: 'badmoebel-set-modern-55cm',
    description: 'Kompaktes Badmöbel-Set ideal für kleinere Badezimmer. Mit Waschbecken 55cm, Spiegelschrank und Unterschrank. Moderne grifflose Optik in Weiß Hochglanz.',
    price: 249.00,
    category: 'Badezimmer',
    subcategory: 'Badmöbel-Sets',
    stock: 20,
    images: ['UxL3Y8nrbioz.jpg'],
    dimensions: '55 x 45 x 50 cm (B x T x H)',
    material: 'MDF, Keramik',
    colors: ['Weiß Hochglanz', 'Grau Matt'],
    features: ['Platzsparend', 'Spiegelschrank', 'Soft-Close']
  },
  {
    name: 'Badmöbel-Set RUSTIC 70cm Holzoptik',
    slug: 'badmoebel-set-rustic-70cm',
    description: 'Badmöbel-Set in warmer Holzoptik kombiniert mit modernem Grau. Natürliches Design mit viel Stauraum. Perfekt für ein gemütliches Badambiente.',
    price: 429.00,
    category: 'Badezimmer',
    subcategory: 'Badmöbel-Sets',
    stock: 12,
    images: ['ByPMhv0YFcQG.jpg'],
    dimensions: '70 x 48 x 53 cm (B x T x H)',
    material: 'MDF Holzdekor, Keramik',
    colors: ['Wildeiche/Grau', 'Eiche Rustikal/Weiß'],
    features: ['Holzoptik', 'Großer Stauraum', 'Naturdesign']
  },
  
  // Garderobe & Flur - Garderoben-Sets
  {
    name: 'Garderoben-Set ENTRANCE 140cm',
    slug: 'garderoben-set-entrance-140cm',
    description: 'Komplettes Garderoben-Set mit Wandpaneel, Spiegel, Schuhschrank und Kleiderhaken. Perfekt für einen stilvollen Eingangsbereich. In modernem Weiß mit viel Stauraum.',
    price: 499.00,
    category: 'Garderobe & Flur',
    subcategory: 'Garderoben-Sets',
    stock: 10,
    images: ['Irf7KclZNO23.jpg'],
    dimensions: '140 x 35 x 200 cm (B x T x H)',
    material: 'MDF, Metall',
    colors: ['Weiß', 'Grau', 'Eiche/Weiß'],
    features: ['Mit Spiegel', 'Schuhablage', 'Viele Haken']
  },
  {
    name: 'Garderoben-Set MODERN HALL 180cm',
    slug: 'garderoben-set-modern-hall-180cm',
    description: 'Großzügiges Garderoben-Set mit offenen Fächern, Schuhablage und Kleiderstange. Modernes Design in Weiß mit viel Platz für die ganze Familie.',
    price: 579.00,
    category: 'Garderobe & Flur',
    subcategory: 'Garderoben-Sets',
    stock: 7,
    images: ['JdvRHg7g0R62.jpg'],
    dimensions: '180 x 40 x 200 cm (B x T x H)',
    material: 'MDF, Metall',
    colors: ['Weiß', 'Schwarz/Weiß'],
    features: ['Offene Fächer', 'Schuhablage', 'Kleiderstange']
  },
  {
    name: 'Garderoben-Set VINTAGE 120cm',
    slug: 'garderoben-set-vintage-120cm',
    description: 'Garderoben-Set im Vintage-Stil mit Holzoptik. Kompakte Lösung für kleinere Flure mit Spiegel, Schuhschrank und Garderobenhaken.',
    price: 389.00,
    category: 'Garderobe & Flur',
    subcategory: 'Garderoben-Sets',
    stock: 15,
    images: ['fNUtA63mNwCB.jpg'],
    dimensions: '120 x 35 x 190 cm (B x T x H)',
    material: 'MDF Holzdekor, Metall',
    colors: ['Used Wood/Vintage', 'Eiche Rustikal'],
    features: ['Vintage-Design', 'Kompakt', 'Mit Spiegel']
  },
  {
    name: 'Garderoben-Set INDUSTRIAL 160cm',
    slug: 'garderoben-set-industrial-160cm',
    description: 'Garderoben-Set im Industrial-Style mit Holz und Metall. Robustes Design mit offenen Regalen, Schuhablage und massiven Metallhaken.',
    price: 529.00,
    category: 'Garderobe & Flur',
    subcategory: 'Garderoben-Sets',
    stock: 9,
    images: ['btUG2GxlBtRE.jpg'],
    dimensions: '160 x 38 x 195 cm (B x T x H)',
    material: 'MDF Holzdekor, Metall',
    colors: ['Eiche/Schwarz', 'Nussbaum/Anthrazit'],
    features: ['Industrial-Design', 'Metallhaken', 'Robust']
  },
  
  // Garderobe & Flur - Schuhschränke
  {
    name: 'Schuhschrank COMPACT 2 Klappen',
    slug: 'schuhschrank-compact-2-klappen',
    description: 'Platzsparender Schuhschrank mit 2 Klappen für ca. 8-10 Paar Schuhe. Schlankes Design ideal für schmale Flure. Kippmechanismus für einfachen Zugriff.',
    price: 129.00,
    category: 'Garderobe & Flur',
    subcategory: 'Schuhschränke',
    stock: 25,
    images: ['07hvEKyTfDWd.jpg'],
    dimensions: '75 x 25 x 103 cm (B x T x H)',
    material: 'MDF',
    colors: ['Weiß', 'Schwarz', 'Eiche'],
    features: ['Platzsparend', 'Kippmechanismus', '2 Fächer']
  },
  {
    name: 'Schuhschrank STORAGE 3 Fächer',
    slug: 'schuhschrank-storage-3-faecher',
    description: 'Schuhschrank mit 3 Fächern und zusätzlichem Stauraum oben. Bietet Platz für ca. 12-15 Paar Schuhe. Moderne Optik in verschiedenen Farben.',
    price: 179.00,
    category: 'Garderobe & Flur',
    subcategory: 'Schuhschränke',
    stock: 18,
    images: ['A2cFtPLu8wAO.webp'],
    dimensions: '90 x 30 x 120 cm (B x T x H)',
    material: 'MDF',
    colors: ['Weiß/Grau', 'Eiche/Weiß', 'Anthrazit'],
    features: ['3 Fächer', 'Zusätzlicher Stauraum', 'Modern']
  },
  
  // Wohnzimmer - TV-Möbel
  {
    name: 'TV-Lowboard MODERN 180cm mit LED',
    slug: 'tv-lowboard-modern-180cm-led',
    description: 'Modernes TV-Lowboard mit integrierter LED-Beleuchtung. Hochglanz-Fronten und viel Stauraum für Multimedia-Geräte. Perfekt für TVs bis 75 Zoll.',
    price: 399.00,
    category: 'Wohnzimmer',
    subcategory: 'TV-Möbel',
    stock: 12,
    images: ['qBkDEkaTvHKn.jpg'],
    dimensions: '180 x 40 x 45 cm (B x T x H)',
    material: 'MDF Hochglanz',
    colors: ['Weiß Hochglanz', 'Schwarz Hochglanz', 'Grau Hochglanz'],
    features: ['LED-Beleuchtung', 'Hochglanz', 'Viel Stauraum']
  },
  {
    name: 'TV-Lowboard PREMIUM 200cm',
    slug: 'tv-lowboard-premium-200cm',
    description: 'Großzügiges TV-Lowboard mit Schubladen und offenen Fächern. Elegante Kombination aus Weiß und Holzoptik. Geeignet für TVs bis 85 Zoll.',
    price: 479.00,
    category: 'Wohnzimmer',
    subcategory: 'TV-Möbel',
    stock: 8,
    images: ['qaphsRYF01Gf.jpg'],
    dimensions: '200 x 42 x 48 cm (B x T x H)',
    material: 'MDF, Holzdekor',
    colors: ['Weiß/Eiche', 'Grau/Nussbaum'],
    features: ['Schubladen', 'Offene Fächer', 'Groß']
  },
  {
    name: 'TV-Lowboard ELEGANCE 160cm',
    slug: 'tv-lowboard-elegance-160cm',
    description: 'Elegantes TV-Lowboard mit Glaselementen und LED-Beleuchtung. Moderne Optik mit viel Platz für AV-Geräte. Für TVs bis 65 Zoll.',
    price: 349.00,
    category: 'Wohnzimmer',
    subcategory: 'TV-Möbel',
    stock: 15,
    images: ['zTh7xOl5a3MB.jpg'],
    dimensions: '160 x 40 x 43 cm (B x T x H)',
    material: 'MDF, Glas',
    colors: ['Artisan/Weiß', 'Schwarz/Grau'],
    features: ['Glaselemente', 'LED-Beleuchtung', 'Modern']
  },
  {
    name: 'TV-Lowboard NORDIC 140cm',
    slug: 'tv-lowboard-nordic-140cm',
    description: 'TV-Lowboard im skandinavischen Stil mit Holzbeinen. Natürliches Design mit Schubladen und offenen Fächern. Perfekt für moderne Wohnzimmer.',
    price: 299.00,
    category: 'Wohnzimmer',
    subcategory: 'TV-Möbel',
    stock: 20,
    images: ['UBlu0iaRU9JD.jpg'],
    dimensions: '140 x 38 x 50 cm (B x T x H)',
    material: 'MDF, Massivholz',
    colors: ['Weiß/Eiche', 'Grau/Buche'],
    features: ['Skandinavisch', 'Holzbeine', 'Schubladen']
  },
  {
    name: 'TV-Lowboard INDUSTRIAL 180cm',
    slug: 'tv-lowboard-industrial-180cm',
    description: 'TV-Lowboard im Industrial-Style mit Metallgriffen. Robustes Design in Holzoptik mit viel Stauraum. Für TVs bis 75 Zoll.',
    price: 429.00,
    category: 'Wohnzimmer',
    subcategory: 'TV-Möbel',
    stock: 10,
    images: ['x4kHMFsn8PC4.jpg'],
    dimensions: '180 x 40 x 45 cm (B x T x H)',
    material: 'MDF Holzdekor, Metall',
    colors: ['Eiche/Schwarz', 'Nussbaum/Anthrazit'],
    features: ['Industrial-Design', 'Metallgriffe', 'Robust']
  }
];

async function uploadImage(imagePath) {
  try {
    const imageBuffer = await fs.readFile(imagePath);
    const fileName = path.basename(imagePath);
    const randomSuffix = Math.random().toString(36).substring(7);
    const fileKey = `products/${fileName.replace(/\.[^/.]+$/, '')}-${randomSuffix}${path.extname(fileName)}`;
    
    const result = await storagePut(fileKey, imageBuffer, 'image/jpeg');
    console.log(`✓ Uploaded: ${fileName} -> ${result.url}`);
    return result.url;
  } catch (error) {
    console.error(`✗ Failed to upload ${imagePath}:`, error.message);
    return null;
  }
}

async function seedCatalog() {
  console.log('🌱 Starting catalog seed...\n');
  
  const db = await getDb();
  if (!db) {
    console.error('❌ Failed to connect to database');
    process.exit(1);
  }
  
  const imagesDir = path.join(__dirname, 'demo-product-images');
  
  for (const product of demoProducts) {
    console.log(`\n📦 Processing: ${product.name}`);
    
    // Upload images
    const imageUrls = [];
    for (const imageName of product.images) {
      const imagePath = path.join(imagesDir, imageName);
      const url = await uploadImage(imagePath);
      if (url) {
        imageUrls.push(url);
      }
    }
    
    if (imageUrls.length === 0) {
      console.log(`⚠️  No images uploaded for ${product.name}, skipping...`);
      continue;
    }
    
    // Insert product into database
    try {
      await db.insert(products).values({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory,
        stock: product.stock,
        images: imageUrls,
        dimensions: product.dimensions,
        material: product.material,
        colors: product.colors,
        features: product.features,
        isActive: true,
        createdAt: new Date()
      });
      console.log(`✓ Product added to database`);
    } catch (error) {
      console.error(`✗ Failed to add product to database:`, error.message);
    }
  }
  
  console.log('\n✅ Catalog seed completed!');
  process.exit(0);
}

seedCatalog().catch(error => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
