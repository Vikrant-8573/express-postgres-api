const bcrypt = require("bcrypt");
const db = require("./postgres-config");

const getAllUsers = (req, res) => {
    db.pool.query("SELECT * FROM users ORDER BY id ASC", (err, result) => {
        if (err) {
            throw err;
        }

        res.status(200).json(result.rows);
    });
}

const getUserByEmail = (req, res) => {
    const email = req.params.email;

    db.pool.query("SELECT * FROM users WHERE email = $1;", [email], (err, result) => {
        if (err) {
            throw err;
        }

        res.status(200).json(result.rows);
    });
}

const createUser = async (req, res) => {
    const { email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 5);

    db.pool.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;", [email, passwordHash], (err, result) => {
        if (err) {
            throw err;
        }

        res.status(201).send(`User added with ID: ${result.rows[0].id}`);
    });
}

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

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    db.pool.query("DELETE FROM users WHERE id = $1", [id], (err, result) => {
        if (err) {
            throw err;
        }

        res.status(200).send(`User deleted with ID: ${id}`);
    });
}

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

module.exports = {
    getAllUsers,
    getUserByEmail,
    createUser,
    deleteUser,
    updateUser,
    validateUser
}
