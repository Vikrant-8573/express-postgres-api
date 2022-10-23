const db = require("../postgres-config");

/**
 * Create a new diary entry
 * @param req the request
 * @param res the response
 */
const createDiaryEntry = async (req, res) => {
    const { title, body } = req.body;

    const entryTitleExists = await doesTitleExist(title);

    if (!entryTitleExists) {
        db.pool.query("INSERT INTO diary_entries (title, body) VALUES ($1, $2) RETURNING *;", [title, body], (err, result) => {
            if (err) {
                return res.json(err)
            }

            res.status(201).send(`New diary entry added with ID: ${result.rows[0].id}.`);
        });
    } else {
        res.status(400).send("Another diary entry with the same title exists. Please use a unique title.");
    }
}

/**
 * Get all available diary entries
 * @param req the request
 * @param res the response
 */
const getAllDiaryEntries = (req, res) => {
    db.pool.query("SELECT * FROM diary_entries;", [], (err, result) => {
        if (err) {
            throw err;
        }

        res.json(result.rows);
    })
}

/**
 * Get a particular diary entry.
 * @param req the request
 * @param res the response
 */
const getDiaryEntry = (req, res) => {
    const id = parseInt(req.params.id);

    db.pool.query("SELECT * FROM diary_entries WHERE id = $1;", [id], (err, result) => {
        if (err) {
            throw err;
        }

        res.json(result.rows);
    });
}

/**
 * Update a diary entry.
 * @param req the request
 * @param res the response
 */
const updateDiaryEntry = (req, res) => {
    const id = parseInt(req.params.id);

    const { title, body } = req.body;

    /** Requirement
     * Both title and body must be provided.
     */
    if (title && body) {
        db.pool.query(
            "UPDATE diary_entries SET title = $1, body = $2 WHERE id = $3;",
            [title, body, id],
            (err, result) => {
                if (err) {
                    throw err;
                }

                res.send(`Diary entry with ID ${id} has been updated successfully!`);
            }
        );
    } else {
        res.status(400).send("Both title and body are required to edit diary entry.");
    }
}

/**
 * Delete a single diary entry.
 * @param req the request
 * @param res the response
 */
const deleteDiaryEntry = (req, res) => {
    const id = parseInt(req.params.id);

    db.pool.query("DELETE FROM diary_entries WHERE id = $1;", [id], (err, result) => {
        if (err) {
            throw err;
        }

        res.send(`The diary entry with ID: ${id} has been deleted.`);
    });
}

/**
 * Checks if the title for a diary entry already exists.
 * @param {String} newEntryTitle The title of a new diary entry
 * @return {Promise<Boolean>}
 */
const doesTitleExist = async (newEntryTitle) => {
    try {
        const result = await db.pool.query("SELECT * FROM diary_entries;", []);
        
        const diaryEntries = result.rows;

        if (diaryEntries.length > 0) {
            const diaryWithSameTitle = diaryEntries.find(entry => entry.title === newEntryTitle);

            if (diaryWithSameTitle !== undefined)
                return true;
            else
                return false;
        } else {
            return false; // this means there are no diary entries in the database.
        }
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createDiaryEntry,
    getAllDiaryEntries,
    getDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry
}
