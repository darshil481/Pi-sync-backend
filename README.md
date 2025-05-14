# 🚀 PiSync Admin Dashboard – Backend

This is the backend for the **PiSync Admin Dashboard** – a system to monitor and manually trigger data syncs from offline-first educational devices (like PiBook and PiBox) to the cloud.

---

## 📦 About PiSync

**PiSync** is a lightweight sync agent used in **offline-first learning environments**. When devices reconnect to the internet, they sync data like videos watched, assignments completed, or notes taken to the cloud.  
This dashboard helps the internal team monitor sync status and errors, and optionally trigger manual syncs.

---

## ⚙️ Technologies Used

- **Node.js**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL** 

---

## 🧪 Features

- Get list of all registered devices with sync status
- Trigger manual sync for a device
- View recent sync errors
- Seeding 15–20 dummy devices with test data

---


---

## 🛠️ Installation & Setup

# Install dependencies
npm install

# Initialize Prisma and DB
npx prisma generate
npx prisma migrate dev --name init

# Seed dummy devices
npm run seed:seed_data
npm run seed:seed_errors

# Start backend server
npm start


## 📄 .env Setup

Create a `.env` file in the root:

```env
PORT=4000
DATABASE_URL='postgres://postgres:postgres@localhost:5432/pisync'
---


![image](https://github.com/user-attachments/assets/93f0ad3a-dbba-4865-ab0c-13f08da771f0)
![image](https://github.com/user-attachments/assets/5bc6c374-2362-4e1a-ad71-ecf033922e82)
![image](https://github.com/user-attachments/assets/81be8cce-80e2-42fb-ae7f-b8c2fcc3f689)


