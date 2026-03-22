const db = require("../db/db");

function addProduct(brandId, name, price, commission_percentage) {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO products (brand_id, name, price, commission_percentage) VALUES (?, ?, ?, ?)",
      [brandId, name, price, commission_percentage],
      (err, result) => {
        if (err) reject(err);
        else resolve("Product created");
      },
    );
  });
}

function getProductsForBrand(brandId) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM products WHERE brand_id = ?",
      [brandId],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      },
    );
  });
}

function getProductsByBrandId(brandId) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM products WHERE brand_id = ?",
      [brandId],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      },
    );
  });
}

function getAllProducts() {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM products",
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      },
    );
  });
}
module.exports = { addProduct, getProductsForBrand, getAllProducts, getProductsByBrandId };
