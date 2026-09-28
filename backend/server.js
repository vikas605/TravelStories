const express = require("express");
const cors = require("cors");

const {
    pool,
    connectDatabase,
    initializeDatabase
} = require("./database");

const app = express();
const PORT = process.env.PORT || 5000;

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

        const result = await pool.query(`
            SELECT
                id,
                title,
                start_place AS start,
                destination,
                transport,
                cost,
                route,
                experience,
                tips,
                created_at AS "createdAt"
            FROM stories
            ORDER BY created_at DESC
        `);

        const stories = result.rows.map(story => ({
            ...story,
            id: Number(story.id),
            cost: Number(story.cost)
        }));

        res.json(stories);

    } catch (error) {

        console.error("Get stories error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to load travel stories."
        });

    }

});


// =====================================================
// GET SINGLE STORY
// =====================================================

app.get("/api/stories/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isFinite(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid story ID."
            });

        }

        const result = await pool.query(`
            SELECT
                id,
                title,
                start_place AS start,
                destination,
                transport,
                cost,
                route,
                experience,
                tips,
                created_at AS "createdAt"
            FROM stories
            WHERE id = $1
        `, [id]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Travel story not found."
            });

        }

        const story = {
            ...result.rows[0],
            id: Number(result.rows[0].id),
            cost: Number(result.rows[0].cost)
        };

        res.json({
            success: true,
            story
        });

    } catch (error) {

        console.error("Get story error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to load the travel story."
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
                message: "Please fill all required fields."
            });

        }

        const numericCost = Number(cost);

        if (
            !Number.isFinite(numericCost) ||
            numericCost < 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid travel cost."
            });

        }

        const id = Date.now();

        await pool.query(`
            INSERT INTO stories
            (
                id,
                title,
                start_place,
                destination,
                transport,
                cost,
                route,
                experience,
                tips
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9
            )
        `, [
            id,
            String(title).trim(),
            String(start).trim(),
            String(destination).trim(),
            String(transport).trim(),
            numericCost,
            String(route).trim(),
            String(experience).trim(),
            tips ? String(tips).trim() : null
        ]);

        res.status(201).json({

            success: true,

            message: "Travel story published successfully!",

            story: {

                id,

                title: String(title).trim(),

                start: String(start).trim(),

                destination: String(destination).trim(),

                transport: String(transport).trim(),

                cost: numericCost,

                route: String(route).trim(),

                experience: String(experience).trim(),

                tips: tips
                    ? String(tips).trim()
                    : ""

            }

        });

    } catch (error) {

        console.error("Create story error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to save the travel story."
        });

    }

});


// =====================================================
// UPDATE STORY
// =====================================================

app.put("/api/stories/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isFinite(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid story ID."
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
                message: "Please fill all required fields."
            });

        }

        const numericCost = Number(cost);

        if (
            !Number.isFinite(numericCost) ||
            numericCost < 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid travel cost."
            });

        }

        const result = await pool.query(`
            UPDATE stories
            SET
                title = $1,
                start_place = $2,
                destination = $3,
                transport = $4,
                cost = $5,
                route = $6,
                experience = $7,
                tips = $8
            WHERE id = $9
        `, [
            String(title).trim(),
            String(start).trim(),
            String(destination).trim(),
            String(transport).trim(),
            numericCost,
            String(route).trim(),
            String(experience).trim(),
            tips ? String(tips).trim() : null,
            id
        ]);

        if (result.rowCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Travel story not found."
            });

        }

        res.json({

            success: true,

            message: "Travel story updated successfully!",

            story: {

                id,

                title: String(title).trim(),

                start: String(start).trim(),

                destination: String(destination).trim(),

                transport: String(transport).trim(),

                cost: numericCost,

                route: String(route).trim(),

                experience: String(experience).trim(),

                tips: tips
                    ? String(tips).trim()
                    : ""

            }

        });

    } catch (error) {

        console.error("Update story error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to update the travel story."
        });

    }

});


// =====================================================
// DELETE STORY
// =====================================================

app.delete("/api/stories/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isFinite(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid story ID."
            });

        }

        const result = await pool.query(`
            DELETE FROM stories
            WHERE id = $1
        `, [id]);

        if (result.rowCount === 0) {

            return res.status(404).json({
                success: false,
                message: "Travel story not found."
            });

        }

        res.json({
            success: true,
            message: "Travel story deleted successfully."
        });

    } catch (error) {

        console.error("Delete story error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to delete the travel story."
        });

    }

});


// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "TravelStories API endpoint not found."
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
                "Server running on port " + PORT
            );

            console.log(
                "API: http://localhost:" +
                PORT +
                "/api/stories"
            );

            console.log(
                "Database: Neon PostgreSQL"
            );

            console.log("");

        });

    } catch (error) {

        console.error("");
        console.error("TravelStories could not start.");
        console.error("");
        console.error(error.message);
        console.error("");

        process.exit(1);
    }

}

startServer();
