const path = require("path");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config({
    path: path.join(__dirname, ".env"),
    override: true
});

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing from .env");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000
});

async function connectDatabase() {
    try {
        const client = await pool.connect();

        console.log("Connected to Neon PostgreSQL");

        client.release();

        return pool;

    } catch (error) {

        console.error("Neon PostgreSQL connection failed:");
        console.error(error.message);

        throw error;
    }
}

async function initializeDatabase() {

    const db = await connectDatabase();

    const query = `
        CREATE TABLE IF NOT EXISTS stories (
            id BIGINT PRIMARY KEY,
            title VARCHAR(300) NOT NULL,
            start_place VARCHAR(200) NOT NULL,
            destination VARCHAR(200) NOT NULL,
            transport VARCHAR(200) NOT NULL,
            cost NUMERIC(10,2) NOT NULL,
            route TEXT NOT NULL,
            experience TEXT NOT NULL,
            tips TEXT,
            created_at TIMESTAMP(7) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await db.query(query);

    console.log("Stories table is ready");
}

module.exports = {
    pool,
    connectDatabase,
    initializeDatabase
};
