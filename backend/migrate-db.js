const { pool } = require("./db");
const fs = require("fs");
const path = require("path");

async function runMigration() {
  try {
    console.log("📦 Reading database.sql...");
    const sqlPath = path.join(__dirname, "database.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("🔄 Running migrations...");
    await pool.query(sql);

    console.log("✅ Database schema created successfully!");

    // Verify tables were created
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log("\n📋 Created tables:");
    tables.rows.forEach((row) => {
      console.log("  ✓", row.table_name);
    });
  } catch (error) {
    console.error("❌ Migration error:", error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

runMigration();
