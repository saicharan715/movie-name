const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbpath = path.join(__dirname, "moviesData.db");

let db = null;

const initilizeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost/:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initilizeDBAndServer();

const convertDbObjectToResponseObj = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

app.get("/movies/", async (request, response) => {
  const getMovies = `
    SELECT * FROM movie;`;

  const movieArray = await db.all(getMovies);
 response.send(
     moviesArray.map((eachMovie) => 
     ({ movieName: eachMovie.movie_name })
});
