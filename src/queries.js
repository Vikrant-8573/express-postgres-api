const bcrypt = require("bcrypt");
const db = require("../postgres-config");

/**
 * Get all users
 * @param req the request
 * @param res the response
 */
const getAllUsers = (req, res) => {
    db.pool.query("SELECT * FROM users ORDER BY id ASC;", (err, result) => {
        if (err) {
            throw err;
        }

        res.status(200).json(result.rows);
    });
}

/**
 * Get a particular user by their email
 * @param req the request
 * @param res the response
 */
const getUserByEmail = (req, res) => {
    const email = req.params.email;

    db.pool.query("SELECT * FROM users WHERE email = $1;", [email], (err, result) => {
        if (err) {
            throw err;
        }

        res.status(200).json(result.rows);
    });
}

/**
 * Create a new user
 * @param req the request
 * @param res the response
 */
const createUser = async (req, res) => {
    const { email, password } = req.body;

    const userExists = await checkUserExists(email);

    console.log(userExists);

    if (!userExists) {
        const passwordHash = await bcrypt.hash(password, 5);
    
        db.pool.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;", [email, passwordHash], (err, result) => {
            if (err) {
                throw err;
            }
    
            res.status(201).send(`User added with ID: ${result.rows[0].id}`);
        });
    } else {
        res.status(400).send("User with this email already exists. Use a different email address.");
    }
    
}

/**
 * Update a user's email and/or password
 * @param req the request
 * @param res the response
 */
const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);

    const { email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 5);

    if (email && password) {
        db.pool.query(
            "UPDATE users SET email = $1, password = $2 WHERE id = $3;",
            [email, passwordHash, id],
            (err, result) => {
                if (err) {
                    throw err;
                }

                res.status(200).send(`User modified with ID: ${id}`);
            }
        );
    } else {
        res.status(400).send("Both email and password must be provided");
    }
}

/**
 * Delete a user with a given id
 * @param req the request
 * @param res the response
 */
const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    db.pool.query("DELETE FROM users WHERE id = $1", [id], (err, result) => {
        if (err) {
            throw err;
        }

        res.status(200).send(`User deleted with ID: ${id}`);
    });
}

/**
 * Validate a user by their password. This function can be used for signing in.
 * @param {*} req the request
 * @param {*} res the response
 */
const validateUser = (req, res) => {
    const { email, password } = req.body;

    db.pool.query("SELECT * FROM users WHERE email = $1;", [email], async (err, result) => {
        if (err) {
            throw err;
        }

        const user = result.rows[0];

        if (user?.id > 0) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                return res.status(200).send("User credentials are valid.");
            } else {
                return res.status(401).send("Invalid password!");
            }
        } else {
            return res.status(404).send("Email not found!");
        }
    });
}

/**
 * Checks if a user with the provided email id already exists.
 * @param {String} userEmail email of a user
 * @returns {Promise<Boolean>}
 */
const checkUserExists = async (userEmail) => {
    try {
        let result = await db.pool.query("SELECT * FROM users WHERE email = $1;", [userEmail]);

        let allUsers = result.rows;

        if (allUsers.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    getAllUsers,
    getUserByEmail,
    createUser,
    deleteUser,
    updateUser,
    validateUser
}
