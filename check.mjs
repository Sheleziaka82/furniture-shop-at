import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { products, users } from "./drizzle/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;

async function check() {
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    const productCount = await db.select().from(products);
    const userList = await db.select().from(users);

    console.log(`\n📊 Статус БД:`);
    console.log(`Товаров в каталоге: ${productCount.length}`);
    console.log(`Пользователей: ${userList.length}`);
    
    if (userList.length > 0) {
      console.log(`\nОставшиеся пользователи:`);
      userList.forEach(u => {
        console.log(`  - ${u.name} (${u.email}) - Роль: ${u.role}`);
      });
    }

    await connection.end();
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

check();
