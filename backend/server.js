const express = require("express");
const cors = require("cors");

const {
    sql,
    connectDatabase,
    initializeDatabase
} = require("./database");

const app = express();
const PORT = process.env.PORT || 5000;


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());


// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "TravelStories Backend is Working"
    });

});


// =====================================================
// GET ALL STORIES
// =====================================================

app.get("/api/stories", async (req, res) => {

    try {

        const db = await connectDatabase();

        const query =
            "SELECT " +
            "Id AS id, " +
            "Title AS title, " +
            "StartPlace AS start, " +
            "Destination AS destination, " +
            "Transport AS transport, " +
            "Cost AS cost, " +
            "Route AS route, " +
            "Experience AS experience, " +
            "Tips AS tips, " +
            "CreatedAt AS createdAt " +
            "FROM Stories " +
            "ORDER BY CreatedAt DESC";

        const result =
            await db.request().query(query);

        res.json(result.recordset);

    } catch (error) {

        console.error(
            "Get stories error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to load travel stories."

        });

    }

});


// =====================================================
// GET SINGLE STORY
// =====================================================

app.get("/api/stories/:id", async (req, res) => {

    try {

        const id =
            Number(req.params.id);

        if (!Number.isFinite(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid story ID."

            });

        }

        const db =
            await connectDatabase();

        const query =
            "SELECT " +
            "Id AS id, " +
            "Title AS title, " +
            "StartPlace AS start, " +
            "Destination AS destination, " +
            "Transport AS transport, " +
            "Cost AS cost, " +
            "Route AS route, " +
            "Experience AS experience, " +
            "Tips AS tips, " +
            "CreatedAt AS createdAt " +
            "FROM Stories " +
            "WHERE Id = @Id";

        const result =
            await db
                .request()
                .input(
                    "Id",
                    sql.BigInt,
                    id
                )
                .query(query);

        if (
            result.recordset.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Travel story not found."

            });

        }

        res.json({

            success: true,

            story:
                result.recordset[0]

        });

    } catch (error) {

        console.error(
            "Get story error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to load the travel story."

        });

    }

});


// =====================================================
// CREATE STORY
// =====================================================

app.post("/api/stories", async (req, res) => {

    try {

        const {
            title,
            start,
            destination,
            transport,
            cost,
            route,
            experience,
            tips
        } = req.body;


        // ---------------------------------------------
        // REQUIRED FIELD VALIDATION
        // ---------------------------------------------

        if (
            !title ||
            !start ||
            !destination ||
            !transport ||
            cost === undefined ||
            cost === null ||
            !route ||
            !experience
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please fill all required fields."

            });

        }


        // ---------------------------------------------
        // COST VALIDATION
        // ---------------------------------------------

        const numericCost =
            Number(cost);

        if (
            !Number.isFinite(numericCost) ||
            numericCost < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid travel cost."

            });

        }


        const db =
            await connectDatabase();


        // ---------------------------------------------
        // GENERATE STORY ID
        // ---------------------------------------------

        const id =
            Date.now();


        // ---------------------------------------------
        // INSERT STORY
        // ---------------------------------------------

        const query =
            "INSERT INTO Stories " +
            "(Id, Title, StartPlace, Destination, Transport, Cost, Route, Experience, Tips) " +
            "VALUES " +
            "(@Id, @Title, @StartPlace, @Destination, @Transport, @Cost, @Route, @Experience, @Tips)";


        await db
            .request()

            .input(
                "Id",
                sql.BigInt,
                id
            )

            .input(
                "Title",
                sql.NVarChar(300),
                String(title).trim()
            )

            .input(
                "StartPlace",
                sql.NVarChar(200),
                String(start).trim()
            )

            .input(
                "Destination",
                sql.NVarChar(200),
                String(destination).trim()
            )

            .input(
                "Transport",
                sql.NVarChar(200),
                String(transport).trim()
            )

            .input(
                "Cost",
                sql.Decimal(10, 2),
                numericCost
            )

            .input(
                "Route",
                sql.NVarChar(sql.MAX),
                String(route).trim()
            )

            .input(
                "Experience",
                sql.NVarChar(sql.MAX),
                String(experience).trim()
            )

            .input(
                "Tips",
                sql.NVarChar(sql.MAX),
                tips
                    ? String(tips).trim()
                    : null
            )

            .query(query);


        res.status(201).json({

            success: true,

            message:
                "Travel story published successfully!",

            story: {

                id,

                title:
                    String(title).trim(),

                start:
                    String(start).trim(),

                destination:
                    String(destination).trim(),

                transport:
                    String(transport).trim(),

                cost:
                    numericCost,

                route:
                    String(route).trim(),

                experience:
                    String(experience).trim(),

                tips:
                    tips
                        ? String(tips).trim()
                        : ""

            }

        });

    } catch (error) {

        console.error(
            "Create story error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to save the travel story."

        });

    }

});


// =====================================================
// UPDATE STORY
// =====================================================

app.put("/api/stories/:id", async (req, res) => {

    try {

        const id =
            Number(req.params.id);


        // ---------------------------------------------
        // ID VALIDATION
        // ---------------------------------------------

        if (!Number.isFinite(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid story ID."

            });

        }


        const {
            title,
            start,
            destination,
            transport,
            cost,
            route,
            experience,
            tips
        } = req.body;


        // ---------------------------------------------
        // REQUIRED FIELD VALIDATION
        // ---------------------------------------------

        if (
            !title ||
            !start ||
            !destination ||
            !transport ||
            cost === undefined ||
            cost === null ||
            !route ||
            !experience
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please fill all required fields."

            });

        }


        // ---------------------------------------------
        // COST VALIDATION
        // ---------------------------------------------

        const numericCost =
            Number(cost);

        if (
            !Number.isFinite(numericCost) ||
            numericCost < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid travel cost."

            });

        }


        const db =
            await connectDatabase();


        // ---------------------------------------------
        // UPDATE QUERY
        // ---------------------------------------------

        const query =
            "UPDATE Stories SET " +
            "Title = @Title, " +
            "StartPlace = @StartPlace, " +
            "Destination = @Destination, " +
            "Transport = @Transport, " +
            "Cost = @Cost, " +
            "Route = @Route, " +
            "Experience = @Experience, " +
            "Tips = @Tips " +
            "WHERE Id = @Id";


        const result =
            await db
                .request()

                .input(
                    "Id",
                    sql.BigInt,
                    id
                )

                .input(
                    "Title",
                    sql.NVarChar(300),
                    String(title).trim()
                )

                .input(
                    "StartPlace",
                    sql.NVarChar(200),
                    String(start).trim()
                )

                .input(
                    "Destination",
                    sql.NVarChar(200),
                    String(destination).trim()
                )

                .input(
                    "Transport",
                    sql.NVarChar(200),
                    String(transport).trim()
                )

                .input(
                    "Cost",
                    sql.Decimal(10, 2),
                    numericCost
                )

                .input(
                    "Route",
                    sql.NVarChar(sql.MAX),
                    String(route).trim()
                )

                .input(
                    "Experience",
                    sql.NVarChar(sql.MAX),
                    String(experience).trim()
                )

                .input(
                    "Tips",
                    sql.NVarChar(sql.MAX),
                    tips
                        ? String(tips).trim()
                        : null
                )

                .query(query);


        // ---------------------------------------------
        // STORY NOT FOUND
        // ---------------------------------------------

        if (
            result.rowsAffected[0] === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Travel story not found."

            });

        }


        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        res.json({

            success: true,

            message:
                "Travel story updated successfully!",

            story: {

                id,

                title:
                    String(title).trim(),

                start:
                    String(start).trim(),

                destination:
                    String(destination).trim(),

                transport:
                    String(transport).trim(),

                cost:
                    numericCost,

                route:
                    String(route).trim(),

                experience:
                    String(experience).trim(),

                tips:
                    tips
                        ? String(tips).trim()
                        : ""

            }

        });

    } catch (error) {

        console.error(
            "Update story error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to update the travel story."

        });

    }

});


// =====================================================
// DELETE STORY
// =====================================================

app.delete("/api/stories/:id", async (req, res) => {

    try {

        const id =
            Number(req.params.id);


        if (!Number.isFinite(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid story ID."

            });

        }


        const db =
            await connectDatabase();


        const query =
            "DELETE FROM Stories WHERE Id = @Id";


        const result =
            await db
                .request()

                .input(
                    "Id",
                    sql.BigInt,
                    id
                )

                .query(query);


        if (
            result.rowsAffected[0] === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Travel story not found."

            });

        }


        res.json({

            success: true,

            message:
                "Travel story deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete story error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to delete the travel story."

        });

    }

});


// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message:
            "TravelStories API endpoint not found."

    });

});


// =====================================================
// START SERVER
// =====================================================

async function startServer() {

    try {

        console.log("");
        console.log("Starting TravelStories...");
        console.log("");

        await connectDatabase();

        await initializeDatabase();


        app.listen(PORT, () => {

            console.log("");
            console.log("======================================");
            console.log("TravelStories Backend");
            console.log("======================================");

            console.log(
                "Server running on port " +
                PORT
            );

            console.log(
                "API: http://localhost:" +
                PORT +
                "/api/stories"
            );

            console.log(
                "SQL Server: Connected"
            );

            console.log("");

        });

    } catch (error) {

        console.error("");
        console.error(
            "TravelStories could not start."
        );

        console.error(
            "Check your SQL Server configuration."
        );

        console.error("");

        console.error(
            error.message
        );

        console.error("");

        process.exit(1);

    }

}


startServer();