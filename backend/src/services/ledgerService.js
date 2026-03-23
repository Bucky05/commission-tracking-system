const db = require("../db/db");

function createLedger(creatorId, commission, referenceId) {
  
  return new Promise((resolve,reject) => {  db.query(
    `INSERT INTO ledger (creator_id, amount, type, status, reference_id)
   VALUES (?, ?, 'credit', 'pending', ?)`,
    [creatorId, commission, referenceId],

  (err,result) => {
    if(err) {
       reject(err)
    } else {
        createWallet(creatorId, commission)
        resolve()
    }
  }
)
})
}

function createWallet(creatorId,commission) {
  db.query(
    `INSERT INTO wallets (creator_id, total_earnings, pending_balance)
   VALUES (?, ?, ?)
   ON DUPLICATE KEY UPDATE
     total_earnings = total_earnings + VALUES(total_earnings),
     pending_balance = pending_balance + VALUES(pending_balance)`,
    [creatorId, commission, commission],
  );
}

module.exports = { createLedger };
