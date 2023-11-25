import express from "express";
import morgan from "morgan";
const app = express();
const PORT = 4000;

import {
  addSong, //create (POST)
  getSongs, //read (GET)
  getSongByID, //read (GET)
  editSong, //update (PATCH)
  deleteSong, //delete (DELETE)
} from "./songs.js";

app.use(express.json()); //Parses the body data and makes it availavble on req.body

app.listen(PORT, function () {
  console.log(`Server is now listening on http://localhost:${PORT}`);
});

//Third party logging middleware: Morgan
app.use(morgan("dev"));

// Custom error handling
app.use(function (req, res, next) {
  console.log(`${req.method} ${req.url}`);
  if (req.method === "PUT") {
    // Send a generic error message to the client
    res.status(400).send("Something went wrong!");
  }
  next();
});

app.get("/", function (req, res) {
  return res.send("Welcome to our song library");
});

app.get("/songs", async function (req, res) {
  const songs = await getSongs();
  const responseObj = {
    status: "success",
    data: songs,
  };
  return res.status(200).json(responseObj);
});

app.get("/songs/:id", async function (req, res) {
  const songID = req.params.id;
  const matchingSong = await getSongByID(songID);
  const responseObj = {
    status: "success",
    data: matchingSong,
  };
  return res.status(200).json(responseObj);
});

app.post("/songs", async function (req, res) {
  const newArtist = req.body.artist;
  const newSong = req.body.song;
  const newLink = req.body.link;
  const newEntry = await addSong(newArtist, newSong, newLink);
  const responseObj = {
    status: "success",
    data: newEntry,
  };
  return res.status(201).json(responseObj);
});

app.patch("/songs/:id", async function (req, res) {
  const songID = req.params.id;
  const newArtist = req.body.artist;
  const newSong = req.body.song;
  const newLink = req.body.link;
  const editedSongs = await editSong(songID, newArtist, newSong, newLink);
  const responseObj = {
    status: "success",
    data: editedSongs,
    message: "Your song was updated successfully!",
  };
  return res.status(200).json(responseObj);
});

app.delete("/songs/:id", async function (req, res) {
  const songID = req.params.id;
  deleteSong(songID);
  const responseObj = {
    status: "success",
    data: `${songID} was deleted`,
  };
  return res.status(200).json(responseObj);
});
