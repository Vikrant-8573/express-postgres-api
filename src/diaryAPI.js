const db = requrire("../postgres-config");

/**
 * Create a new diary entry
 * @param req the request
 * @param res the response
 */
const createDiaryEntry = (req, res) => {
    const { title, body } = req.body;
    
    db.pool.query("INSERT INTO diaryEntries (title, body) VALUES ($1, $2) RETURNING *;", [title, body], (err, result) => {
        if (err) {
            throw err;
        }

        res.status(201).send(`New diary entry added with ID: ${result.rows[0].id}.`);
    });
}

/**
 * Get a particular diary entry.
 * @param req the request
 * @param res the response
 */
const getDiaryEntry = (req, res) => {
    const id = parseInt(req.params.id);

    db.pool.query("SELECT * FROM diaryEntries WHERE id = $1;", [id], (err, result) => {
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
            "UPDATE diaryEntries SET title = $1, body = $2 WHERE id = $3;",
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

    db.pool.query("DELETE FROM diaryEntries WHERE id = $1;", [id], (err, result) => {
        if (err) {
            throw err;
        }

        res.send(`The diary entry with ID: ${id} has been deleted.`);
    });
}

module.exports = {
    createDiaryEntry,
    getDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry
}
