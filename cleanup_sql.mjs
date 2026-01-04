import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function cleanup() {
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    
    // Удалить все товары
    console.log("Удаление всех товаров...");
    await connection.execute("DELETE FROM products");
    console.log("✓ Все товары удалены");

    // Удалить всех пользователей кроме Serhiy Zubovskyy
    console.log("Удаление пользователей кроме Serhiy Zubovskyy...");
    await connection.execute("DELETE FROM users WHERE name != ?", ["Serhiy Zubovskyy"]);
    console.log("✓ Пользователи удалены (кроме Serhiy Zubovskyy)");

    // Проверка
    const [products] = await connection.execute("SELECT COUNT(*) as count FROM products");
    const [users] = await connection.execute("SELECT * FROM users");
    
    console.log(`\n📊 Статус БД:`);
    console.log(`Товаров в каталоге: ${products[0].count}`);
    console.log(`Пользователей: ${users.length}`);
    
    if (users.length > 0) {
      console.log(`\nОставшиеся пользователи:`);
      users.forEach(u => {
        console.log(`  - ${u.name} (${u.email}) - Роль: ${u.role}`);
      });
    }

    console.log("\n✓ Очистка завершена!");
    await connection.end();
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

cleanup();
