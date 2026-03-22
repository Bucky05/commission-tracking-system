const db = require('../db/db')


function trackClick(productId, creatorId) {
  return new Promise((resolve, reject) => {
      db.query(
        `SELECT 1 FROM applications WHERE product_id = ? AND creator_id = ? AND status = 'approved'`,
        [productId, creatorId],
        (err, result) => {
          if (result.length > 0) {
            db.query(
              "INSERT INTO clicks (product_id, creator_id) VALUES (?, ?)",
              [productId, creatorId],
              (err,result) => {
                if(err) {
                    console.log("Error tracking for product Id : "+productId +" and creator Id: "+creatorId)
                }
                resolve()
              }
            );
          } else {
            reject("Invalid url")
          }
        },
      );
  });
}


module.exports = {
    trackClick
}