const express = require("express");

const userController = require("./src/queries");
const diaryController = require("./src/diaryAPI");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ info: "A PostgreSQL API." });
});

app.get("/users", userController.getAllUsers);
app.get("/users/:email", userController.getUserByEmail);
app.post("/users", userController.createUser);
app.put("/users/:id", userController.updateUser);
app.delete("/users/:id", userController.deleteUser);
app.post("/users/login", userController.validateUser);

app.post("/diary", diaryController.createDiaryEntry);
app.get("/diary/:id", diaryController.getDiaryEntry);
app.put("/diary/:id", diaryController.updateDiaryEntry);
app.delete("/diary/:id", diaryController.deleteDiaryEntry);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
