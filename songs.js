import { promises as fs } from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

// import path from node:path is combined with filePath to allow song.js file to link with songs.json

const filePath = path.resolve(process.cwd(), "songs.json");

// CREATE

// asynchronous function to create a new object in JSON file with parameters of artist, song, link and adding an UUID
export async function addSong(artist, song, link = "Unknown") {
  // create a variable that reads the songs.json file, takes the data and assigns it to songsJSON
  const songsJSON = await fs.readFile(filePath, "utf-8");
  // create a variable that translates the songs.json data format into a js format
  const songs = JSON.parse(songsJSON);
  // create a new song object template and implement the uuid function from the Package/module(?)
  const newSong = {
    id: uuidv4(),
    artist,
    song,
    link,
  };
  // method to push the new song object onto songs array
  songs.push(newSong);
  // waiting for the async function promise to finish writing the new song objects to songs variable in the JSON format
  await fs.writeFile(filePath, JSON.stringify(songs, null, 2), "utf-8");
  return newSong;
}

// READ

//Reading songs.json file and returning all songs in file
export async function getSongs() {
  //reading file
  const songsJSON = await fs.readFile(filePath, "utf-8");
  const songs = JSON.parse(songsJSON);
  return songs;
}
//gettting a song by Id
export async function getSongByID(id) {
  //Reading file
  const songsJSON = await fs.readFile(filePath, "utf-8");
  const songs = JSON.parse(songsJSON);
  //Checking each item in array with for loop
  for (const song of songs) {
    if (song.id === id) {
      return song;
    }
  }
  return null;
}

// UPDATE

export async function editSong(id, newArtist, newSong, newLink) {
  const songsJSON = await fs.readFile(filePath, "utf-8");
  const songs = JSON.parse(songsJSON);

  // create emty variable for editing later
  let song = null;
  // Iterate over all of the songs in the song json
  for (let i = 0; i < songs.length; i++) {
    if (songs[i].id === id) {
      // If the id is a match to the one priovided by the client, update each of the key/value pairs, provided they are not a match
      song = songs[i];
      songs[i].artist = newArtist ?? songs[i].artist;
      songs[i].song = newSong ?? songs[i].song;
      songs[i].link = newLink ?? songs[i].link;
      break;
    }
  }

  // wait on the file to be written to the json
  await fs.writeFile(filePath, JSON.stringify(songs, null, 2), "utf-8");

  return song;
}

// DELETE

// write an sync function that is exported
export async function deleteSong(id) {
  // Get the json file and parse it into a readable format
  const songsJSON = await fs.readFile(filePath, "utf-8");
  const songs = JSON.parse(songsJSON);

  let songIndex = null;

  // that searches for the right song by id
  for (let i = 0; i < songs.length; i++) {
    if (id === songs[i].id) {
      // delete that entire entry
      songIndex = i;
      break;
    }
  }

  if (songIndex !== null) {
    const deletedSong = songs.splice(songIndex, 1);
    await fs.writeFile(filePath, JSON.stringify(songs, null, 2), "utf-8");
    return deletedSong[0];
  }

  return null;
  // give us confirmation that the entry was deleted
}

console.log(await deleteSong("123"));
