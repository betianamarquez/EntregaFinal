const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const passport = require("passport");

dotenv.config();

const usersRouter = require("./routes/users.router");
const sessionsRouter = require("./routes/sessions.router");
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const ticketsRouter = require("./routes/tickets.router");

require("./config/passport.config");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

app.use(express.json());

app.use(passport.initialize());

app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/tickets", ticketsRouter);

const PORT = 8080;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB conectado correctamente");

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar con MongoDB:", error);
  });
