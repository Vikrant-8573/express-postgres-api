const express = require("express");

const query = require("./queries");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ info: "A PostgreSQL API." });
});

app.get("/users", query.getAllUsers);
app.get("/users/:email", query.getUserByEmail);
app.post("/users", query.createUser);
app.put("/users/:id", query.updateUser);
app.delete("/users/:id", query.deleteUser);
app.post("/users/login", query.validateUser);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
