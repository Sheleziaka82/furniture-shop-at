import { storagePut } from './server/storage.ts';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simplified demo products matching the ProductFormData structure
const demoProducts = [
  // Badezimmer
  {
    name: 'Badmöbel-Set ELEGANCE 60cm',
    description: 'Modernes Badmöbel-Set mit Waschtisch 60cm, LED-Spiegel und Unterschrank. Grifflose Fronten in Matt Weiß sorgen für eine zeitlose Eleganz.',
    price: 349.00,
    category: 'Badezimmer',
    subcategory: 'Badmöbel-Sets',
    stock: 15,
    imageFile: 'YrDArcq0OOw9.jpg',
    dimensions: '60 x 46 x 52 cm',
    material: 'MDF, Keramik',
    colors: ['Matt Weiß', 'Anthrazit'],
  },
  {
    name: 'Badmöbel-Set PREMIUM 80cm',
    description: 'Luxuriöses Badmöbel-Set mit Doppelwaschbecken 80cm, perfekt für größere Badezimmer. Mit integrierter LED-Beleuchtung und viel Stauraum.',
    price: 599.00,
    category: 'Badezimmer',
    subcategory: 'Badmöbel-Sets',
    stock: 8,
    imageFile: 'WJt208hLW5Ax.jpg',
    dimensions: '80 x 50 x 55 cm',
    material: 'MDF, Keramik, Glas',
    colors: ['Beige/Gold'],
  },
  {
    name: 'Badmöbel-Set MODERN 55cm',
    description: 'Kompaktes Badmöbel-Set ideal für kleinere Badezimmer. Mit Waschbecken 55cm, Spiegelschrank und Unterschrank.',
    price: 249.00,
    category: 'Badezimmer',
    subcategory: 'Badmöbel-Sets',
    stock: 20,
    imageFile: 'UxL3Y8nrbioz.jpg',
    dimensions: '55 x 45 x 50 cm',
    material: 'MDF, Keramik',
    colors: ['Weiß Hochglanz', 'Grau Matt'],
  },
  {
    name: 'Badmöbel-Set RUSTIC 70cm',
    description: 'Badmöbel-Set in warmer Holzoptik kombiniert mit modernem Grau. Natürliches Design mit viel Stauraum.',
    price: 429.00,
    category: 'Badezimmer',
    subcategory: 'Badmöbel-Sets',
    stock: 12,
    imageFile: 'ByPMhv0YFcQG.jpg',
    dimensions: '70 x 48 x 53 cm',
    material: 'MDF Holzdekor',
    colors: ['Wildeiche/Grau'],
  },
  
  // Garderobe & Flur
  {
    name: 'Garderoben-Set ENTRANCE 140cm',
    description: 'Komplettes Garderoben-Set mit Wandpaneel, Spiegel, Schuhschrank und Kleiderhaken. Perfekt für einen stilvollen Eingangsbereich.',
    price: 499.00,
    category: 'Garderobe & Flur',
    subcategory: 'Garderoben-Sets',
    stock: 10,
    imageFile: 'Irf7KclZNO23.jpg',
    dimensions: '140 x 35 x 200 cm',
    material: 'MDF, Metall',
    colors: ['Weiß', 'Grau'],
  },
  {
    name: 'Garderoben-Set MODERN HALL 180cm',
    description: 'Großzügiges Garderoben-Set mit offenen Fächern, Schuhablage und Kleiderstange. Modernes Design in Weiß.',
    price: 579.00,
    category: 'Garderobe & Flur',
    subcategory: 'Garderoben-Sets',
    stock: 7,
    imageFile: 'JdvRHg7g0R62.jpg',
    dimensions: '180 x 40 x 200 cm',
    material: 'MDF, Metall',
    colors: ['Weiß'],
  },
  {
    name: 'Garderoben-Set VINTAGE 120cm',
    description: 'Garderoben-Set im Vintage-Stil mit Holzoptik. Kompakte Lösung für kleinere Flure mit Spiegel und Schuhschrank.',
    price: 389.00,
    category: 'Garderobe & Flur',
    subcategory: 'Garderoben-Sets',
    stock: 15,
    imageFile: 'fNUtA63mNwCB.jpg',
    dimensions: '120 x 35 x 190 cm',
    material: 'MDF Holzdekor',
    colors: ['Used Wood Vintage'],
  },
  {
    name: 'Schuhschrank COMPACT 2 Klappen',
    description: 'Platzsparender Schuhschrank mit 2 Klappen für ca. 8-10 Paar Schuhe. Schlankes Design ideal für schmale Flure.',
    price: 129.00,
    category: 'Garderobe & Flur',
    subcategory: 'Schuhschränke',
    stock: 25,
    imageFile: '07hvEKyTfDWd.jpg',
    dimensions: '75 x 25 x 103 cm',
    material: 'MDF',
    colors: ['Weiß', 'Schwarz'],
  },
  
  // Wohnzimmer
  {
    name: 'TV-Lowboard MODERN 180cm',
    description: 'Modernes TV-Lowboard mit integrierter LED-Beleuchtung. Hochglanz-Fronten und viel Stauraum für Multimedia-Geräte.',
    price: 399.00,
    category: 'Wohnzimmer',
    subcategory: 'TV-Möbel',
    stock: 12,
    imageFile: 'qBkDEkaTvHKn.jpg',
    dimensions: '180 x 40 x 45 cm',
    material: 'MDF Hochglanz',
    colors: ['Weiß Hochglanz'],
  },
  {
    name: 'TV-Lowboard PREMIUM 200cm',
    description: 'Großzügiges TV-Lowboard mit Schubladen und offenen Fächern. Elegante Kombination aus Weiß und Holzoptik.',
    price: 479.00,
    category: 'Wohnzimmer',
    subcategory: 'TV-Möbel',
    stock: 8,
    imageFile: 'qaphsRYF01Gf.jpg',
    dimensions: '200 x 42 x 48 cm',
    material: 'MDF, Holzdekor',
    colors: ['Weiß/Eiche'],
  },
  {
    name: 'TV-Lowboard ELEGANCE 160cm',
    description: 'Elegantes TV-Lowboard mit Glaselementen und LED-Beleuchtung. Moderne Optik mit viel Platz für AV-Geräte.',
    price: 349.00,
    category: 'Wohnzimmer',
    subcategory: 'TV-Möbel',
    stock: 15,
    imageFile: 'zTh7xOl5a3MB.jpg',
    dimensions: '160 x 40 x 43 cm',
    material: 'MDF, Glas',
    colors: ['Artisan/Weiß'],
  },
  {
    name: 'TV-Lowboard NORDIC 140cm',
    description: 'TV-Lowboard im skandinavischen Stil mit Holzbeinen. Natürliches Design mit Schubladen und offenen Fächern.',
    price: 299.00,
    category: 'Wohnzimmer',
    subcategory: 'TV-Möbel',
    stock: 20,
    imageFile: 'UBlu0iaRU9JD.jpg',
    dimensions: '140 x 38 x 50 cm',
    material: 'MDF, Massivholz',
    colors: ['Weiß/Eiche'],
  },
  {
    name: 'TV-Lowboard INDUSTRIAL 180cm',
    description: 'TV-Lowboard im Industrial-Style mit Metallgriffen. Robustes Design in Holzoptik mit viel Stauraum.',
    price: 429.00,
    category: 'Wohnzimmer',
    subcategory: 'TV-Möbel',
    stock: 10,
    imageFile: 'x4kHMFsn8PC4.jpg',
    dimensions: '180 x 40 x 45 cm',
    material: 'MDF Holzdekor, Metall',
    colors: ['Eiche/Schwarz'],
  }
];

async function uploadImage(imagePath) {
  try {
    const imageBuffer = await fs.readFile(imagePath);
    const fileName = path.basename(imagePath);
    const randomSuffix = Math.random().toString(36).substring(7);
    const fileKey = `products/${fileName.replace(/\.[^/.]+$/, '')}-${randomSuffix}${path.extname(fileName)}`;
    
    const result = await storagePut(fileKey, imageBuffer, 'image/jpeg');
    console.log(`✓ Uploaded: ${fileName}`);
    return result.url;
  } catch (error) {
    console.error(`✗ Failed to upload ${imagePath}:`, error.message);
    return null;
  }
}

async function seedCatalog() {
  console.log('🌱 Starting catalog seed...\n');
  
  const imagesDir = path.join(__dirname, 'demo-product-images');
  let successCount = 0;
  let failCount = 0;
  
  for (const product of demoProducts) {
    console.log(`\n📦 Processing: ${product.name}`);
    
    // Upload image
    const imagePath = path.join(imagesDir, product.imageFile);
    const imageUrl = await uploadImage(imagePath);
    
    if (!imageUrl) {
      console.log(`⚠️  No image uploaded, skipping...`);
      failCount++;
      continue;
    }
    
    // Prepare product data for database (using tRPC create format)
    const productData = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory,
      stock: product.stock,
      images: [imageUrl],
      dimensions: product.dimensions,
      material: product.material,
      colors: product.colors,
    };
    
    console.log(`✓ Product data prepared: ${product.name}`);
    console.log(`  Price: €${product.price}`);
    console.log(`  Category: ${product.category} > ${product.subcategory}`);
    console.log(`  Stock: ${product.stock}`);
    console.log(`  Image: ${imageUrl.substring(0, 60)}...`);
    successCount++;
  }
  
  console.log(`\n✅ Catalog seed completed!`);
  console.log(`   Success: ${successCount} products`);
  console.log(`   Failed: ${failCount} products`);
  console.log(`\n📝 Note: Images uploaded to S3. Use admin panel to add products with these URLs.`);
  process.exit(0);
}

seedCatalog().catch(error => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
