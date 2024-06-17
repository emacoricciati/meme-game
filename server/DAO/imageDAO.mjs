
import db from "../db/db.mjs";
import { Image, Caption } from "../components/Image.mjs";


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export default function ImageDAO(){

    this.getCaptionsByImageId = (imageId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT captions.id, captions.caption FROM image_captions JOIN captions ON captions.id = image_captions.caption_id WHERE image_id = ? LIMIT 2';
            db.all(query, [imageId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows === undefined || rows.length === 0) {
                    reject({error: 'Captions not found.'});
                } else {
                    resolve(rows.map(row => new Caption(row.id, row.caption, true)));
                }
            });
        });
    }

    // get random captions
    this.getRandomCaptions = (excludedIds) => {
        return new Promise((resolve, reject) => {
            const placeholders = excludedIds.map(() => '?').join(',');
            const query = `SELECT * FROM captions WHERE id NOT IN (${placeholders}) ORDER BY RANDOM() LIMIT 5`;
            db.all(query, excludedIds, (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows === undefined || rows.length === 0) {
                    reject({ error: 'Captions not found.' });
                } else {
                    resolve(rows.map(row => new Caption(row.id, row.caption, false)));
                }
            });
        });
    };

    this.getRandomImage = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM images ORDER BY RANDOM() LIMIT 1';
            try {
                db.get(query, async (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    if (row === undefined) {
                        reject({error: 'Image not found.'});
                    } else {
                        const correctCaptions = await this.getCaptionsByImageId(row.id);
                        const wrongCaptions = await this.getRandomCaptions(correctCaptions.map(caption => caption.id));
                        const array = correctCaptions.concat(wrongCaptions);
                        shuffleArray(array);
                        resolve(new Image(row.id, row.filename, array));
                    }
                });
            }
            catch(err) {
                reject(err);
            }
        });
    }
    
}