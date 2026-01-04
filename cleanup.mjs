import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { products, users } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL не установлена");
  process.exit(1);
}

async function cleanup() {
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    // Удалить все товары
    console.log("Удаление всех товаров...");
    await db.delete(products);
    console.log("✓ Все товары удалены");

    // Удалить всех пользователей кроме Serhiy Zubovskyy
    console.log("Удаление пользователей кроме Serhiy Zubovskyy...");
    const allUsers = await db.select().from(users);
    
    for (const user of allUsers) {
      if (user.name !== "Serhiy Zubovskyy") {
        await db.delete(users).where(eq(users.id, user.id));
        console.log(`✓ Удален пользователь: ${user.name}`);
      }
    }

    console.log("✓ Очистка завершена!");
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("Ошибка:", error);
    process.exit(1);
  }
}

cleanup();
