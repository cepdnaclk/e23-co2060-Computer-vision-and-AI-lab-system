require('dotenv').config();
const pool = require('./config/db');
const xlsx = require('xlsx');
const fs = require('fs');

const seedInventory = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`Error: File not found at ${filePath}`);
            console.log("Usage: node seedInventory.js <path-to-csv-or-excel-file>");
            process.exit(1);
        }

        console.log(`Reading file: ${filePath}`);
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            console.log("File is empty or invalid format.");
            process.exit(0);
        }

        console.log(`Found ${data.length} items. Seeding into the database...`);
        let insertedCount = 0;

        for (const row of data) {
            // Normalize keys to lowercase to be safe
            const item = {};
            for (let key in row) {
                if (row.hasOwnProperty(key)) {
                    item[key.toLowerCase().trim()] = row[key];
                }
            }

            // Map according to your exact Excel headers:
            // "Components" -> name
            // "Use Case" -> description
            const name = item.name || item.components || item.component;
            const category = item.category || item.type || 'Equipment'; // Default to Equipment
            const description = item.description || item['use case'] || item.usecase || 'Added via seed script';

            if (!name) {
                console.warn("Skipping row due to missing 'Components' or 'name':", row);
                continue;
            }

            await pool.query(
                'INSERT INTO inventory (name, category, description, status) VALUES ($1, $2, $3, $4)', 
                [name, category, description, 'available']
            );
            insertedCount++;
        }

        console.log(`Successfully inserted ${insertedCount} items!`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error.message);
        process.exit(1);
    }
};

const args = process.argv.slice(2);
const filePath = args[0];

if (!filePath) {
    console.error("Error: Please provide a path to the CSV/Excel file.");
    console.log("Example: node seedInventory.js ./uploads/data.csv");
    process.exit(1);
}

seedInventory(filePath);
