const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.join(__dirname, '../database/data.sqlite');

let db;

async function initDatabase() {
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS Flights (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            route TEXT NOT NULL,
            fuel_cost REAL NOT NULL,
            airport_charges REAL NOT NULL,
            capacity INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Workers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            role TEXT NOT NULL,
            payment_type TEXT NOT NULL,
            rate REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Allocations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            worker_id INTEGER,
            flight_id INTEGER,
            units_assigned REAL,
            FOREIGN KEY(worker_id) REFERENCES Workers(id),
            FOREIGN KEY(flight_id) REFERENCES Flights(id)
        );
    `);

    // Seed Workers for Story Mode if empty
    const workerCount = await db.get('SELECT COUNT(*) as count FROM Workers');
    if (workerCount.count === 0) {
        await db.run(`INSERT INTO Workers (name, type, role, payment_type, rate) VALUES 
            ('Ravi', 'domestic', 'Cabin Crew', 'per_flight', 3000),
            ('Priya', 'intl', 'Cabin Crew', 'per_flight', 5000),
            ('Aisha', 'domestic', 'Pilot', 'per_flight', 25000),
            ('Raj', 'intl', 'Pilot', 'per_flight', 40000),
            ('Amit', 'ground', 'Ground Staff', 'monthly', 50000)
        `);
    }

    // Seed Flights for Story Mode if empty
    const flightCount = await db.get('SELECT COUNT(*) as count FROM Flights');
    if (flightCount.count === 0) {
        await db.run(`INSERT INTO Flights (route, fuel_cost, airport_charges, capacity) VALUES 
            ('Mumbai - Delhi', 150000, 20000, 150),
            ('Mumbai - Dubai', 350000, 50000, 300)
        `);
    }

    console.log("Database initialized and schema verified.");
}

function getDb() {
    return db;
}

module.exports = { initDatabase, getDb };
