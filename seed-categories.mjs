import { getDb } from './server/db.ts';
import { categories } from './drizzle/schema.ts';

// Categories structure from planetmoebel.de
const categoriesData = [
  // Main category: Badezimmer
  {
    name: 'Badezimmer',
    slug: 'badezimmer',
    description: 'Hochwertige Badmöbel für Ihr Traumbad',
    parentId: null,
    displayOrder: 1,
    subcategories: [
      { name: 'Badmöbel-Sets', slug: 'badmoebel-sets', description: 'Komplette Badmöbel-Sets mit Waschtisch', displayOrder: 1 },
      { name: 'Gästebad-Sets', slug: 'gaestebad-sets', description: 'Kompakte Lösungen für das Gästebad', displayOrder: 2 },
      { name: 'Hochschrank', slug: 'hochschrank', description: 'Hochschränke für zusätzlichen Stauraum', displayOrder: 3 },
      { name: 'Spiegelschrank', slug: 'spiegelschrank', description: 'Spiegelschränke mit und ohne Beleuchtung', displayOrder: 4 },
      { name: 'Waschtischunterschrank', slug: 'waschtischunterschrank', description: 'Unterschränke für Waschtische', displayOrder: 5 },
      { name: 'Badzubehör', slug: 'badzubehoer', description: 'Accessoires und Zubehör fürs Bad', displayOrder: 6 },
    ]
  },
  // Main category: Wohnzimmer
  {
    name: 'Wohnzimmer',
    slug: 'wohnzimmer',
    description: 'Stilvolle Möbel für Ihr Wohnzimmer',
    parentId: null,
    displayOrder: 2,
    subcategories: [
      { name: 'TV-Möbel', slug: 'tv-moebel', description: 'Moderne TV-Lowboards und Medienmöbel', displayOrder: 1 },
      { name: 'Wohnzimmermöbel', slug: 'wohnzimmermoebel', description: 'Komplette Wohnzimmermöbel-Sets', displayOrder: 2 },
      { name: 'Regale & Vitrinen', slug: 'regale-vitrinen', description: 'Regale und Vitrinen für Stauraum', displayOrder: 3 },
      { name: 'Couchtische', slug: 'couchtische', description: 'Couchtische in verschiedenen Stilen', displayOrder: 4 },
    ]
  },
  // Main category: Garderobe & Flur
  {
    name: 'Garderobe & Flur',
    slug: 'garderobe-flur',
    description: 'Praktische Möbel für Eingangsbereich und Flur',
    parentId: null,
    displayOrder: 3,
    subcategories: [
      { name: 'Garderoben-Sets', slug: 'garderoben-sets', description: 'Komplette Garderoben-Sets', displayOrder: 1 },
      { name: 'Schuhschränke', slug: 'schuhschraenke', description: 'Schuhschränke und Schuhregale', displayOrder: 2 },
      { name: 'Flurmöbel', slug: 'flurmoebel', description: 'Einzelmöbel für den Flur', displayOrder: 3 },
      { name: 'Garderoben', slug: 'garderoben', description: 'Wandgarderoben und Standgarderoben', displayOrder: 4 },
    ]
  },
];

async function seedCategories() {
  console.log('🌱 Starting categories seed...\n');
  
  const db = await getDb();
  if (!db) {
    console.error('❌ Failed to connect to database');
    process.exit(1);
  }
  
  let mainCategoryCount = 0;
  let subcategoryCount = 0;
  
  for (const mainCat of categoriesData) {
    console.log(`\n📁 Creating main category: ${mainCat.name}`);
    
    // Insert main category
    const [mainCategory] = await db.insert(categories).values({
      name: mainCat.name,
      slug: mainCat.slug,
      description: mainCat.description,
      parentId: null,
      displayOrder: mainCat.displayOrder,
      isActive: true,
    });
    
    const mainCategoryId = mainCategory.insertId;
    mainCategoryCount++;
    console.log(`✓ Main category created with ID: ${mainCategoryId}`);
    
    // Insert subcategories
    if (mainCat.subcategories && mainCat.subcategories.length > 0) {
      for (const subCat of mainCat.subcategories) {
        console.log(`  ├─ Creating subcategory: ${subCat.name}`);
        
        await db.insert(categories).values({
          name: subCat.name,
          slug: subCat.slug,
          description: subCat.description,
          parentId: mainCategoryId,
          displayOrder: subCat.displayOrder,
          isActive: true,
        });
        
        subcategoryCount++;
        console.log(`  ✓ Subcategory created: ${subCat.name}`);
      }
    }
  }
  
  console.log(`\n✅ Categories seed completed!`);
  console.log(`   Main categories: ${mainCategoryCount}`);
  console.log(`   Subcategories: ${subcategoryCount}`);
  console.log(`   Total: ${mainCategoryCount + subcategoryCount}`);
  process.exit(0);
}

seedCategories().catch(error => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
