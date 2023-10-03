const express = require("express");
const pool = require("./db");
const db = require("./db");

const HOST = "0.0.0.0";
const PORT = 3000;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM users");
    res.status(200).send(data.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const data = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.status(200).send(data.rows);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

app.post("/users", async (req, res) => {
  const { email, password } = req.body;
  try {
    await pool.query(
      `INSERT INTO users (email, password) VALUES ('${email}', crypt('${password}', gen_salt('bf')))`
    );
    res.status(200).send({
      message: "User successfully created",
    });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

app.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  const { email, password } = req.body;
  try {
    pool.query(
      `UPDATE users SET email='${email}', password='${password}' WHERE id=${id}`
    );
    res.status(200).send({
      message: "User successfully updated",
    });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query(`DELETE from users * WHERE id=${id}`);
    res.status(200).send({
      message: "User successfully deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

app.listen(PORT, HOST, () =>
  console.log(`Server listening on port ${PORT}...`)
);
