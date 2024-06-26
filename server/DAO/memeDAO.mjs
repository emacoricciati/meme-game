import db from "../db/db.mjs";
import { Meme, Caption } from "../components/Meme.mjs";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default function MemeDAO() {
  this.getCaptionsByImageId = (imageId) => {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT captions.id, captions.caption FROM image_captions JOIN captions ON captions.id = image_captions.caption_id WHERE image_id = ? LIMIT 2";
      db.all(query, [imageId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        if (rows === undefined || rows.length === 0) {
          reject({ error: "Captions not found." });
        } else {
          resolve(rows.map((row) => new Caption(row.id, row.caption)));
        }
      });
    });
  };

  // get random captions
  this.getRandomCaptions = (excludedIds) => {
    return new Promise((resolve, reject) => {
      const placeholders = excludedIds.map(() => "?").join(",");
      const query = `SELECT * FROM captions WHERE id NOT IN (${placeholders}) ORDER BY RANDOM() LIMIT 5`;
      db.all(query, excludedIds, (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows === undefined || rows.length === 0) {
          reject({ error: "Captions not found." });
        } else {
          resolve(rows.map((row) => new Caption(row.id, row.caption)));
        }
      });
    });
  };

  this.getRandomImage = (excludedIds = "") => {
    return new Promise((resolve, reject) => {
        let query;
        if(excludedIds.length === 0){
            query = `SELECT * FROM images ORDER BY RANDOM() LIMIT 1`;
        }else {
            query = `SELECT * FROM images WHERE id NOT IN (${excludedIds}) ORDER BY RANDOM() LIMIT 1`;
        }

      try {
        db.get(query, async (err, row) => {
          if (err) {
            reject(err);
          }
          if (row === undefined) {
            reject({ error: "Meme not found." });
          } else {
            const correctCaptions = await this.getCaptionsByImageId(row.id);
            const wrongCaptions = await this.getRandomCaptions(
              correctCaptions.map((caption) => caption.id)
            );
            const array = correctCaptions.concat(wrongCaptions);
            shuffleArray(array);
            resolve(new Meme(row.id, row.filename, array));
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  // Validate the meme caption answer, it returns an object with isCorrect field and in case isCorrect is false, it returns the correct captions
  this.validateAnswer = (imageId, captionId) => {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM image_captions WHERE image_id = ? AND caption_id = ?";
      db.get(query, [imageId, captionId], (err, row) => {
        if (err) {
          reject(err);
          return;
        } else {
          this.getCaptionsByImageId(imageId).then((correctCaptions) => {
            resolve({ isCorrect: row !== undefined, correctCaptions });
          });
        }
      });
    });
  };
}
