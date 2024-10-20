import express from "express";
import appRouter from "src/app/app.router";
import { Database } from "@config";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import appSocket from "./app/app.socket";

const app = express();
dotenv.config();

//config
app.use(express.json());
app.use(cors({ credentials: true }));
app.use(express.urlencoded({ extended: true }));

// routing
app.use("/api", appRouter);

// database setting
Database.initialize().then(() => {
  console.log("database is successfully configuration");
});

// server open
const server = app.listen(process.env.SERVER_PORT, () => {
  console.log(`Listening on ${process.env.SERVER_PORT}`);
});

// socket open
const io = new Server(server);
appSocket(io);
