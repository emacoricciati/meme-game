import db from "../db/db.mjs";

export default function GameDAO() {
  this.saveRound = (gameId, round) => {
    const { round_number, imageId, captionId, points } = round;
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO rounds (game_id, round_number, image_id, caption_id, points) VALUES (?, ?, ?, ?, ?)";
      db.run(
        query,
        [gameId, round_number, imageId, captionId, points],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  };

  this.saveGame = (userId, total, date, time_taken, rounds) => {
    const self = this;
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO games (user_id, total, date, time_taken) VALUES (?,?,?,?)";
      db.run(query, [userId, total, date, time_taken], function (err) {
        if (err) {
          reject(err);
        } else {
          try {
            rounds.forEach(async (round) => {
              await self.saveRound(this.lastID, round);
            });
          } catch (err) {
            reject(err);
          }
          resolve(this.lastID);
        }
      });
    });
  };

  this.getGame = (userId, gameId) => {
    return new Promise((resolve, reject) => {
      const query = `
            SELECT 
                games.game_id AS game_id, 
                games.total AS total, 
                games.date AS date, 
                games.time_taken AS time_taken,
                rounds.round_number AS round_number,
                images.filename AS filename,
                captions.caption AS caption,
                rounds.points AS round_points
                FROM games 
                JOIN rounds ON games.game_id = rounds.game_id 
                JOIN images ON rounds.image_id = images.id
                LEFT JOIN captions ON rounds.caption_id = captions.id
                WHERE games.user_id = ? AND games.game_id = ?`;

                // LEFT JOIN captions ON rounds.caption_id = captions.id in case of captionId is null
      db.all(query, [userId, gameId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        } else {
          if (rows.length === 0 || rows === undefined) {
            reject({ status: 404, error: "Game not found." });
            return;
          }

          const game = {
            game_id: rows[0].game_id,
            total: rows[0].total,
            date: rows[0].date,
            time_taken: rows[0].time_taken,
            rounds: rows.map((row) => ({
              round_number: row.round_number,
              image: row.filename,
              caption: row.caption ? row.caption : "Not answered",
              points: row.round_points,
            })),
          };

          resolve(game);
        }
      });
    });
  };

  this.getAllGames = (userId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM games WHERE user_id = ?";
      db.all(query, [userId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        if (rows) {
          resolve(rows);
        }
      });
    });
  };

  this.getTotalPoints = (userId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT SUM(total) as total FROM games WHERE user_id = ?";
      db.get(query, [userId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if(!row){
          reject({ status: 404, error: "Points not available." });
          return;
        }
        if (row) {
          resolve(row.total);
        }
      });
    });
  }

  this.getUnlockedMemes = (userId) => {
    return new Promise((resolve, reject) => {

      const unlockedQuery = "SELECT COUNT(DISTINCT image_id) as unlocked FROM rounds JOIN games ON rounds.game_id = games.game_id WHERE user_id = ?";
      const totalQuery = "SELECT COUNT(*) as total FROM images";
  
      db.get(unlockedQuery, [userId], (err, unlockedRow) => {
        if (err) {
          reject(err);
          return;
        }
  
        db.get(totalQuery, [], (err, totalRow) => {
          if (err) {
            reject(err);
            return;
          }
  
          if (unlockedRow && totalRow) {
            resolve({
              unlockedMemes: unlockedRow.unlocked,
              totalMemes: totalRow.total
            });
          } else {
            reject({ status: 404, error: "Unlocked memes not available." });
          }
        });
      });
    });
  };
  
}
