const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
let db = null;
const dbpath = path.join(__dirname, "cricketTeam.db");
app.use(express.json());
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000);
  } catch (e) {
    console.log(`DB Error ${e.message}`);

    process.exit(1);
  }
};
initializeDBAndServer();

//api 1 GET
app.get("/players/", async (request, response) => {
  const allplayerslistquery = `
        SELECT * FROM cricket_team ORDER BY player_id;
    `;
  const playerslist = await db.all(allplayerslistquery);
  response.send(playerslist);
});
//api post
app.post("/players/", async (request, response) => {
  const playerdetails = request.body;
  const { player_name, jersey_number, role } = playerdetails;
  const postquery = `
        INSERT INTO cricket_team (player_name,jersey_number,role)
        VALUES (${player_name},${jersey_number},${role});

    `;
  const postresponse = await db.run(postquery);
  const player_id = postresponse.lastID;
  response.send("Player Added to Team");
});
//get playerid
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const specifiedplayerquery = `
            SELECT * FROM cricket_team ORDER BY player_id WHERE player_id=${playerId};
    `;
  const singleplayer = await db.get(specifiedplayerquery);
  response.send(singleplayer);
});
//put
app.put("/players/:playerId/", async (request, response) => {
  const { player_Id } = request.params;
  const { playerdetails } = request.body;
  const { player_name, jersey_number, role } = playerdetails;
  const putquery = `
        UPDATE cricket_team
        SET 
        player_name =${player_name},
        jersey_number=${jersey_number},
        role=${roles}
        WHERE player_id=${player_Id};
    `;
  const putresponse = await db.run(putquery);
  response.send("Player Details Updated");
});
//delete
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletequery = `
        DELETE FROM cricket_team WHERE player_id=${playerId};
    `;
  const deleteresponse = await db.run(deletequery);
  response.send("Player Removed");
});

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};
module.exports = app;
