# 🚀 Commission Tracking System

An end-to-end system for tracking commissions earned by creators (influencers) collaborating with brands through referral links.

Reference video tutorial : https://www.loom.com/share/7ceb8508e0c24dacbc8f69b2d2771651
---

## 📌 Features

### 👤 Authentication & Roles

* Email/password login
* Roles:

  * Brand
  * Creator
  * Admin

---

### 🏢 Brand

* Add products (name, price, commission %)
* View creator applications
* Approve / reject creators

---

### 🎯 Creator

* View available products
* Apply for campaigns
* View application status
* Generate referral links (after approval)
* Track earnings
* Request payouts

---

### 🛠️ Admin

* View conversions
* Approve earnings (pending → available)
* View payout requests

---

### 🔗 Referral System

* Referral format:

```txt
/api/v1/product/:id?ref=creatorId
```

Flow:

* Click tracked on backend
* Redirect to frontend product page
* Buy → conversion recorded

---

### 💰 Wallet System

Each creator has:

* **Pending Balance** → not yet approved
* **Available Balance** → withdrawable
* **Total Earnings**

---

### 📒 Ledger System

* Tracks all transactions
* Ensures:

  * No double payout
  * Proper balance updates
  * Auditability

---

## ⚙️ Tech Stack

* **Frontend:** Next.js (TypeScript)
* **Backend:** Node.js + Express
* **Database:** MySQL
* **Authentication:** JWT

---

## 🏗️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/Bucky05/commission-tracking-system
cd commission-tracking-system
```

---

### 2. Database Setup

* Open MySQL
* Run queries from:

```txt
DB.sql
```

---

### 3. Install Dependencies

Open **two terminals**:

#### Backend

```bash
cd backend
npm install
npm start
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Test Credentials

### 👤 Creator

* Email: [creator1@gmail.com](mailto:creator1@gmail.com)
* Password: Password@123

### 🏢 Brand

* Email: [nike@gmail.com](mailto:nike@gmail.com)
* Password: Password@123

### 🛠️ Admin

* Email: [admin@gmail.com](mailto:admin@gmail.com)
* Password: Password@123

---

## 🔄 System Flow

```txt
Brand creates product
→ Creator applies
→ Brand approves

→ Creator generates referral link
→ User clicks link (click tracked)
→ User buys (conversion recorded)

→ Admin approves conversion
→ Pending → Available balance

→ Creator requests payout
→ Status: Processing
```

---

## ❌ How Double Payout is Prevented

* Wallet row locking (`SELECT ... FOR UPDATE`)
* Transaction-based payout handling
* Ledger reference_id ensures uniqueness

---

## ⚡ Scaling Approach (1M clicks/day)

* Queue-based click tracking (Kafka/RabbitMQ)
* Redis caching for analytics
* Batch processing for clicks
* Pre-aggregated reporting tables

---

## 🔧 Improvements (Future Scope)

* Payment gateway integration (Stripe/Razorpay)
* Referral token instead of creatorId
* Rate limiting & security checks
* Better UI/UX
* Pagination & filters

---

## 🎯 Summary

This system demonstrates:

* Full-stack architecture
* Clean role-based access control
* Financial correctness using ledger + transactions
* Scalable design considerations

---
