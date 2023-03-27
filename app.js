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
    movieArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;

  const { directorId, movieName, leadActor } = movieDetails;

  const addMovie = `
    INSERT INTO 
    movie(director_Id, movie_name, lead_actor)
    VALUES (
        '${directorId}',
        '${movieName}',
        '${leadActor}'
    );`;

  const dbResponse = await db.run(addMovie);

  const movieId = dbResponse.lastId;

  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const getMovie = `
    SELECT * 
    FROM movie 
    WHERE movie_id = ${movieId};`;

  const movieDetails = await db.get(getMovie);

  response.send(movieDetails);
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;

  const { directorId, movieName, leadActor } = movieDetails;

  const updateMovie = `
    UPDATE movie 

    SET
    director_id = '${directorId}',
    movie_name = '${movieName}',
    lead_actor = '${leadActor}'
    
    WHERE movie_id = ${movieId};`;

  await db.run(updateMovie);

  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const deleteMovie = `
    DELETE FROM 
    movie 
    where movie_id = ${movieId};`;

  await db.run(deleteMovie);

  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const { directorId } = directorId;

  const getDirDetails = `
    SELECT * FROM director;`;

  const dirDetails = await db.get(getDirDetails);

  response.send(dirDetails);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const getMovies = `
    SELECT * FROM movie;`;

  const movieArray = await db.all(getMovies);
  response.send(
    movieArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});

module.exports = app;
