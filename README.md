# 💸 Splitwise Clone

A full-stack expense-splitting application inspired by Splitwise. This application allows users to create groups, track shared expenses, and automatically calculate the settlements needed to balance debts efficiently.

## ✨ Features

- **User Authentication:** Secure registration and login using JWT and BCrypt password hashing.
- **Group Management:** Create groups for roommates, trips, or events, and invite members.
- **Expense Tracking:** Add expenses within groups.
- **Multiple Split Strategies:**
  - **Equal:** Split the expense equally among all members.
  - **Exact:** Specify exactly how much each person owes.
  - **Percentage:** Split by percentages (e.g., 60% / 40%).
- **Settlement Optimization:** Uses a greedy algorithm to calculate the minimum number of transactions needed to settle all debts in a group.
- **Modern UI:** Built with React, Tailwind CSS, and shadcn/ui for a beautiful and responsive user experience.

## 🛠️ Tech Stack

### Backend
- **Framework**: Play Framework 2.x (Java)
- **Database**: MySQL 8 (with Ebean ORM)
- **Security**: JWT Authentication & BCrypt
- **Dependency Injection**: Google Guice

### Frontend
- **Framework**: React 19 (TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & shadcn/ui
- **HTTP Client**: Axios
- **Routing**: React Router 7

## 🚀 Getting Started

### Prerequisites
- Java (JDK 21 or compatible)
- Node.js (v18+)
- MySQL Server
- SBT (Scala Build Tool)

### 1. Database Setup
1. Create a MySQL database:
   ```sql
   CREATE DATABASE splitwise;
   ```
2. Create a file at `conf/application.local.conf` with your database credentials:
   ```hocon
   db.default.url="jdbc:mysql://localhost:3306/splitwise"
   db.default.username="root"
   db.default.password="your_password"
   ```

### 2. Running the Backend (Play Framework)
Open your terminal in the project root and start the Play server:
```bash
sbt run
```
The backend API will be available at `http://localhost:9000`.

### 3. Running the Frontend (React/Vite)
Open a new terminal window, navigate to the frontend directory, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will be available at `http://localhost:5173`.

## 📖 Documentation
For more in-depth architectural details, database schemas, and API design, please refer to the [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) and files within the `/docs` directory.
