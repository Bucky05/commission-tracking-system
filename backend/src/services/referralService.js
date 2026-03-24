const db = require("../db/db");

function createReferralApplication(productId, creatorId) {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO applications (creator_id, product_id) VALUES (?, ?)",
      [creatorId, productId],
      (err, result) => {
        if (err) {
          reject("Already applied");
        } else resolve("Application submitted");
      },
    );
  });
}

function getApplicationsByBrandId(brandId) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT a.*, p.name AS product_name, u.email AS creator_email
        FROM applications a
        JOIN products p ON a.product_id = p.id
        JOIN users u ON a.creator_id = u.id
        WHERE p.brand_id = ?`,
      [brandId],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      },
    );
  });
}

function updateApplicationStatus(id, status) {
  return new Promise((resolve, reject) => {

    db.query(
      "SELECT status FROM applications WHERE id = ?",
      [id],
      (err, results) => {
        if (err) return reject(err);

        if (results.length === 0) {
          return reject(new Error("Application not found"));
        }

        const currentStatus = results[0].status;

        if (currentStatus === 'approved' || currentStatus === 'rejected') {
          return reject(new Error("Application already processed"));
        }

        db.query(
          "UPDATE applications SET status = ? WHERE id = ?",
          [status, id],
          (err2) => {
            if (err2) return reject(err2);

            resolve();
          }
        );
      }
    );
  });
}

function getReferralLink(creatorId, productId) {
  return new Promise((resolve, reject) => {

    db.query(
      'SELECT * FROM applications WHERE creator_id = ? AND product_id = ? AND status = "approved"',
      [creatorId, productId],
      (err, results) => {

        if (err) return reject(err);

        if (results.length === 0) {
          return reject(new Error("Not approved"));
        }

        const link = `http://localhost:3500/api/v1/product/${productId}?ref=${creatorId}`;

        resolve(link);
      }
    );

  });
}

function getApplicationsByCreatorId(creatorId) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT a.*, p.name AS product_name, u.email AS brand_email
        FROM applications a
        JOIN products p ON a.product_id = p.id
        JOIN users u ON p.brand_id = u.id
        WHERE a.creator_id = ?`,
      [creatorId],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      },
    );
  });
}


module.exports = {
  createReferralApplication,
  getApplicationsByBrandId,
  updateApplicationStatus,
  getReferralLink,
  getApplicationsByCreatorId
};
