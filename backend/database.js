
const path = require("path");
const dotenv = require("dotenv");
const sql = require("mssql");

dotenv.config({
    path: path.join(__dirname, ".env"),
    override: true
});

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    options: {
        instanceName: process.env.DB_INSTANCE,
        encrypt: false,
        trustServerCertificate: true
    },

    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

async function connectDatabase() {
    try {
        if (pool && pool.connected) {
            return pool;
        }

        pool = await sql.connect(config);

        console.log("Connected to SQL Server");

        return pool;

    } catch (error) {
        console.error("SQL Server connection failed:");
        console.error(error.message);

        throw error;
    }
}

async function initializeDatabase() {
    const db = await connectDatabase();

    const query = [
        "IF NOT EXISTS (",
        "    SELECT 1",
        "    FROM sys.tables",
        "    WHERE name = 'Stories'",
        ")",
        "BEGIN",
        "    CREATE TABLE Stories (",
        "        Id BIGINT PRIMARY KEY,",
        "        Title NVARCHAR(300) NOT NULL,",
        "        StartPlace NVARCHAR(200) NOT NULL,",
        "        Destination NVARCHAR(200) NOT NULL,",
        "        Transport NVARCHAR(200) NOT NULL,",
        "        Cost DECIMAL(10,2) NOT NULL,",
        "        Route NVARCHAR(MAX) NOT NULL,",
        "        Experience NVARCHAR(MAX) NOT NULL,",
        "        Tips NVARCHAR(MAX) NULL,",
        "        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()",
        "    );",
        "END"
    ].join("\n");

    await db.request().query(query);

    console.log("Stories table is ready");
}

module.exports = {
    sql,
    config,
    connectDatabase,
    initializeDatabase
};

