# Splitwise Clone — Project Report

**Project Title:** Splitwise Clone — Group Expense Management System  
**Organization:** Savify  
**Version:** 1.0-SNAPSHOT  
**Date:** June 2026

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Design Patterns](#6-design-patterns)
7. [Database Design](#7-database-design)
8. [Module Descriptions](#8-module-descriptions)
9. [REST API Documentation](#9-rest-api-documentation)
10. [Data Flow & Sequence of Operations](#10-data-flow--sequence-of-operations)
11. [Core Algorithms](#11-core-algorithms)
12. [Frontend Architecture](#12-frontend-architecture)
13. [Error Handling Strategy](#13-error-handling-strategy)
14. [Configuration & Deployment](#14-configuration--deployment)
15. [Sample Walkthrough](#15-sample-walkthrough)
16. [Future Enhancements](#16-future-enhancements)
17. [Conclusion](#17-conclusion)

---

## 1. Introduction

The **Splitwise Clone** is a full-stack web application that replicates the core functionality of Splitwise — a popular
expense-sharing platform. It enables groups of users to track shared expenses, calculate individual shares using
multiple splitting strategies, maintain running balances, and compute optimized settlement plans.

The application follows a clean **MVC architecture** with a decoupled frontend and backend communicating via RESTful
APIs. The backend is built on the **Play Framework** (Java), leveraging **Ebean ORM** for database interactions and *
*Google Guice** for dependency injection. The frontend uses **React** with **TypeScript** for a type-safe, responsive
user interface.

---

## 2. Problem Statement

When groups of people share expenses (roommates, trips, dining out), manually tracking who owes whom becomes error-prone
and tedious. Key challenges include:

- **Tracking multiple expenses** across different payers and participants
- **Supporting different split methods** (equal, exact amounts, percentages)
- **Computing net balances** between all pairs of users in a group
- **Minimizing the number of settlement transactions** needed to clear all debts
- **Providing a real-time, responsive interface** for expense management

---

## 3. Objectives

| # | Objective                                               | Status        |
|---|---------------------------------------------------------|---------------|
| 1 | User registration and management                        | ✅ Implemented |
| 2 | Group creation with member management                   | ✅ Implemented |
| 3 | Expense creation with multiple split strategies         | ✅ Implemented |
| 4 | Expense editing and deletion with balance recalculation | ✅ Implemented |
| 5 | Real-time group balance tracking                        | ✅ Implemented |
| 6 | Optimized settlement computation (debt simplification)  | ✅ Implemented |
| 7 | Expense categorization                                  | ✅ Implemented |
| 8 | Responsive React frontend with modern UI                | ✅ Implemented |
| 9 | RESTful API with consistent error handling              | ✅ Implemented |

---

## 4. Technology Stack

### 4.1 Backend

| Component            | Technology           | Version  |
|----------------------|----------------------|----------|
| Framework            | Play Framework       | 2.x      |
| Language             | Java                 | 11+      |
| ORM                  | Ebean                | 12.16.1  |
| Build Tool           | SBT                  | —        |
| Dependency Injection | Google Guice         | Built-in |
| Database             | MySQL                | 8.0      |
| JDBC Driver          | mysql-connector-java | 8.0.33   |
| Serialization        | Jackson (Play JSON)  | Built-in |

### 4.2 Frontend

| Component     | Technology       |
|---------------|------------------|
| Framework     | React 18         |
| Language      | TypeScript       |
| Build Tool    | Vite             |
| HTTP Client   | Axios            |
| Routing       | React Router DOM |
| UI Components | ShadCN UI        |
| Icons         | Lucide React     |

### 4.3 Infrastructure

| Component         | Detail                       |
|-------------------|------------------------------|
| Backend Port      | `localhost:9000`             |
| Frontend Port     | `localhost:5173`             |
| Database          | `localhost:3306/splitwise`   |
| Schema Management | Play Evolutions (auto-apply) |

---

## 5. System Architecture

### 5.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                       │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────┐  ┌───────────┐ │
│  │  Pages   │──│  Components  │  │  Service Layer  │──│   Types   │ │
│  └──────────┘  └──────────────┘  └───────┬────────┘  └───────────┘ │
└──────────────────────────────────────────┬──────────────────────────┘
                                           │ HTTP REST (JSON)
                                           │ Port 5173 → 9000
┌──────────────────────────────────────────┼──────────────────────────┐
│                    BACKEND (Play Framework)                          │
│  ┌─────────────────┐                     │                          │
│  │   Error Handler  │                    ▼                          │
│  └────────┬────────┘          ┌──────────────────┐                  │
│           │                   │  API Controllers  │                  │
│           │                   └────────┬─────────┘                  │
│           │                            │                            │
│           │              ┌─────────────┼─────────────┐              │
│           │              ▼             ▼             ▼              │
│           │    ┌──────────────┐ ┌──────────┐ ┌──────────────────┐   │
│           │    │   Mappers    │ │ Services │ │   Strategies     │   │
│           │    │ (Entity→DTO) │ │(Interface)│ │ (Split Algos)    │   │
│           │    └──────────────┘ └─────┬────┘ └────────┬─────────┘   │
│           │              ▼            │               │             │
│           │    ┌──────────────┐ ┌─────┴────┐ ┌───────┴──────────┐  │
│           │    │     DTOs     │ │  Service  │ │ Strategy Factory │  │
│           │    │              │ │   Impls   │ │                  │  │
│           │    └──────────────┘ └─────┬────┘ └──────────────────┘  │
│           │                           │                            │
│           │                    ┌──────┴──────┐                     │
│           │                    │ Ebean Models │                     │
│           │                    │   (Entity)   │                     │
│           │                    └──────┬──────┘                     │
└───────────┼───────────────────────────┼────────────────────────────┘
            │                           │ Ebean ORM / JDBC
            │                    ┌──────┴──────┐
            │                    │    MySQL     │
            │                    │   Database   │
            │                    └─────────────┘
```

### 5.2 Layered Architecture

| Layer              | Responsibility                                                   | Components                    |
|--------------------|------------------------------------------------------------------|-------------------------------|
| **Presentation**   | HTTP routing, JSON serialization, request/response               | Controllers, ErrorHandler     |
| **Transfer**       | Shape API data, decouple internal models from external contracts | DTOs, Mappers                 |
| **Business Logic** | Core operations, validations, algorithms                         | Services, Strategies, Factory |
| **Data Access**    | ORM mapping, database queries                                    | Ebean Models, Finders         |
| **Persistence**    | Data storage, schema management                                  | MySQL, Evolutions             |

---

## 6. Design Patterns

### 6.1 Strategy Pattern

**Problem:** Expenses can be split in multiple ways (equal, exact, percentage). The algorithm varies but the interface
remains the same.

**Solution:** Define a `SplitStrategy` interface with three concrete implementations. The appropriate strategy is
selected at runtime based on the `SplitType` enum.

```
         ┌──────────────────────┐
         │   <<interface>>      │
         │    SplitStrategy     │
         │──────────────────────│
         │ +calculateSplit()    │
         └──────────┬───────────┘
                    │
          ┌─────────┼──────────┐
          ▼         ▼          ▼
   ┌──────────┐ ┌────────┐ ┌────────────┐
   │  Equal   │ │ Exact  │ │ Percentage │
   │ Strategy │ │Strategy│ │  Strategy  │
   └──────────┘ └────────┘ └────────────┘
```

### 6.2 Factory Pattern

**Problem:** Client code should not know which strategy to instantiate.

**Solution:** `SplitStrategyFactory.getStrategy(SplitType)` returns the correct concrete strategy using a `switch`
statement.

### 6.3 Template Method Pattern

**Problem:** All services share common CRUD behavior.

**Solution:** `BaseServiceImpl<T, ID>` provides generic `save()`, `findById()`, `findAll()`, `update()`, `delete()`
using Ebean's `Finder<ID, T>`. Concrete services extend this and add domain-specific methods.

### 6.4 DTO Pattern

**Problem:** Internal entity models should not be directly exposed to the API layer.

**Solution:** 13 DTO classes provide clean request/response shapes. Mappers handle the Entity ↔ DTO conversion.

### 6.5 Dependency Injection

**Problem:** Controllers should not be tightly coupled to concrete service implementations.

**Solution:** Guice binds interfaces to implementations in `Module.java`. Controllers receive services via `@Inject`
constructor injection.

---

## 7. Database Design

### 7.1 Entity-Relationship Diagram

```
    ┌──────────┐          ┌────────────────────┐          ┌──────────┐
    │  USERS   │──────────│ USER_GROUPS_USERS   │──────────│  USER_   │
    │          │   M:N    │  (Join Table)       │   M:N    │  GROUPS  │
    │  id (PK) │          │  user_groups_id(FK) │          │  id (PK) │
    │  name    │          │  users_id (FK)      │          │  name    │
    │  email   │          └────────────────────┘          └────┬─────┘
    └────┬─────┘                                               │
         │ 1:N                                            1:N  │
         │                                                     │
    ┌────┴──────────┐                                ┌─────────┴─────┐
    │   EXPENSES    │                                │ GROUP_BALANCES│
    │               │                                │               │
    │  id (PK)      │                                │  id (PK)      │
    │  group_id(FK) │                                │  group_id(FK) │
    │  expense_name │         1:N                    │  debtor_id(FK)│
    │  paid_by_id   │──────────┐                     │  creditor_id  │
    │  amount       │          │                     │  amount       │
    │  split_type   │     ┌────┴────┐                └───────────────┘
    │  category     │     │ SPLITS  │
    └───────────────┘     │         │
                          │ id (PK) │
                          │ expense │
                          │  _id(FK)│
                          │ user_id │
                          │  (FK)   │
                          │ amount  │
                          └─────────┘
```

### 7.2 Table Specifications

#### `users`

| Column  | Type           | Constraints                |
|---------|----------------|----------------------------|
| `id`    | `BIGINT`       | PK, AUTO_INCREMENT         |
| `name`  | `VARCHAR(255)` | —                          |
| `email` | `VARCHAR(255)` | Unique (application-level) |

#### `user_groups`

| Column | Type           | Constraints        |
|--------|----------------|--------------------|
| `id`   | `BIGINT`       | PK, AUTO_INCREMENT |
| `name` | `VARCHAR(255)` | —                  |

> **Note:** Named `user_groups` instead of `groups` to avoid MySQL reserved keyword conflict.

#### `user_groups_users` (Join Table)

| Column           | Type     | Constraints                         |
|------------------|----------|-------------------------------------|
| `user_groups_id` | `BIGINT` | FK → `user_groups.id`, Composite PK |
| `users_id`       | `BIGINT` | FK → `users.id`, Composite PK       |

#### `expenses`

| Column         | Type           | Constraints                    |
|----------------|----------------|--------------------------------|
| `id`           | `BIGINT`       | PK, AUTO_INCREMENT             |
| `group_id`     | `BIGINT`       | FK → `user_groups.id`          |
| `expense_name` | `VARCHAR(255)` | —                              |
| `paid_by_id`   | `BIGINT`       | FK → `users.id`                |
| `amount`       | `DOUBLE`       | —                              |
| `split_type`   | `VARCHAR(20)`  | ENUM: EQUAL, EXACT, PERCENTAGE |
| `category`     | `VARCHAR(30)`  | Default: 'OTHER'               |

#### `splits`

| Column       | Type     | Constraints        |
|--------------|----------|--------------------|
| `id`         | `BIGINT` | PK, AUTO_INCREMENT |
| `expense_id` | `BIGINT` | FK → `expenses.id` |
| `user_id`    | `BIGINT` | FK → `users.id`    |
| `amount`     | `DOUBLE` | —                  |

#### `group_balances`

| Column        | Type     | Constraints           |
|---------------|----------|-----------------------|
| `id`          | `BIGINT` | PK, AUTO_INCREMENT    |
| `group_id`    | `BIGINT` | FK → `user_groups.id` |
| `debtor_id`   | `BIGINT` | FK → `users.id`       |
| `creditor_id` | `BIGINT` | FK → `users.id`       |
| `amount`      | `DOUBLE` | —                     |

### 7.3 Non-Persisted Models

| Model         | Purpose                                                                                   |
|---------------|-------------------------------------------------------------------------------------------|
| `Settlement`  | Transient POJO holding simplified settlement (from → to, amount). Computed on-the-fly.    |
| `UserBalance` | Transient POJO used internally by the settlement algorithm to track per-user net balance. |

---

## 8. Module Descriptions

### 8.1 Controllers (`controllers.api`)

| Controller                | Responsibility                                | Injected Services                   |
|---------------------------|-----------------------------------------------|-------------------------------------|
| `ApiUserController`       | User CRUD                                     | `UserService`                       |
| `ApiGroupController`      | Group management, member ops, expense listing | `GroupService`, `SettlementService` |
| `ApiExpenseController`    | Expense CRUD                                  | `ExpenseService`, `GroupService`    |
| `ApiSettlementController` | Fetch simplified settlements                  | `SettlementService`, `GroupService` |
| `ErrorHandler`            | Global exception → JSON response mapping      | —                                   |

### 8.2 Services (Interfaces + Implementations)

| Service                                           | Key Methods                                                | Dependencies          |
|---------------------------------------------------|------------------------------------------------------------|-----------------------|
| `UserService` / `UserServiceImpl`                 | `createUser()`, `updateUser()`                             | `User.find`           |
| `GroupService` / `GroupServiceImpl`               | `createGroupWithMembers()`, `addMember()`, `getExpenses()` | `UserService`         |
| `ExpenseService` / `ExpenseServiceImpl`           | `createExpense()`, `updateExpense()`, `delete()`           | `GroupBalanceService` |
| `GroupBalanceService` / `GroupBalanceServiceImpl` | `addTransaction()`, `recalculateGroupBalances()`           | `GroupBalance.find`   |
| `SettlementService` / `SettlementServiceImpl`     | `simplifySettlements()`                                    | `GroupBalanceService` |

### 8.3 Strategies (`strategies`)

| Strategy                  | Algorithm                                                     |
|---------------------------|---------------------------------------------------------------|
| `EqualSplitStrategy`      | `amount / participantCount` per person (payer gets 0)         |
| `ExactSplitStrategy`      | User-specified exact amounts (validates sum = total)          |
| `PercentageSplitStrategy` | `amount × percentage / 100` per person (validates sum = 100%) |

### 8.4 Mappers (`mapper`)

| Mapper               | Conversion                                                             |
|----------------------|------------------------------------------------------------------------|
| `UserMapper`         | `User` → `UserDTO`                                                     |
| `GroupMapper`        | `Group` → `GroupDTO`, `Group + Settlements` → `GroupDetailDTO`         |
| `ExpenseMapper`      | `Expense` → `ExpenseDTO`, `Expense` → `ExpenseDetailDTO` (with splits) |
| `GroupBalanceMapper` | `GroupBalance` → `GroupBalanceDTO`                                     |
| `SettlementMapper`   | `Settlement` → `SettlementDTO`                                         |

---

## 9. REST API Documentation

### 9.1 User Endpoints

#### `GET /api/users`

- **Description:** Retrieve all registered users
- **Response:** `200 OK` — `[{id, name, email}, ...]`

#### `POST /api/users`

- **Description:** Register a new user
- **Request Body:** `{name: string, email: string}`
- **Response:** `201 Created` — `{id, name, email}`
- **Errors:** `400` if name/email empty or email duplicate

### 9.2 Group Endpoints

#### `GET /api/groups`

- **Description:** Retrieve all groups with members
- **Response:** `200 OK` — `[{id, name, members: [{id, name, email}]}]`

#### `POST /api/groups`

- **Description:** Create a group with initial members
- **Request Body:** `{name: string, memberIds: [number]}`
- **Response:** `201 Created` — `{id, name, members: [...]}`

#### `GET /api/groups/:id`

- **Description:** Get group by ID
- **Response:** `200 OK` — `{id, name, members: [...]}`
- **Errors:** `404` if group not found

#### `GET /api/groups/:id/detail`

- **Description:** Get full group detail including expenses, balances, settlements
- **Response:** `200 OK` — `{id, name, members, expenses, groupBalances, settlements}`
- **Errors:** `404` if group not found

#### `POST /api/groups/:id/members`

- **Description:** Add a member to an existing group
- **Request Body:** `{userId: number}`
- **Response:** `200 OK` — `"Member added"`
- **Errors:** `404` if user or group not found

#### `DELETE /api/groups/:id`

- **Description:** Delete a group and all associated data
- **Response:** `200 OK` — `"Group deleted"`

#### `GET /api/groups/:groupId/expenses`

- **Description:** Get all expenses for a group
- **Response:** `200 OK` — `[{id, expenseName, amount, paidBy, splitType, category}]`

### 9.3 Expense Endpoints

#### `GET /api/expenses/:id`

- **Description:** Get expense detail with individual splits
- **Response:** `200 OK` — `{id, expenseName, amount, paidBy, splitType, groupId, splits: [{user, amount}], category}`

#### `POST /api/groups/:groupId/expenses`

- **Description:** Create an expense in a group
- **Request Body:**

```json
{
  "expenseName": "Dinner",
  "paidByID": 1,
  "amount": 900.0,
  "splitType": "EQUAL",
  "participantIDs": [
    1,
    2,
    3
  ],
  "values": [],
  "category": "FOOD"
}
```

- **Response:** `201 Created` — `ExpenseDTO`
- **Side Effect:** Triggers group balance recalculation

#### `PUT /api/groups/:groupId/expenses/:id`

- **Description:** Update an existing expense
- **Request Body:** Same as create
- **Response:** `200 OK` — `ExpenseDTO`
- **Side Effect:** Old splits deleted, new splits computed, balances recalculated

#### `DELETE /api/groups/:groupId/expenses/:id`

- **Description:** Delete an expense
- **Response:** `200 OK` — `"Expense deleted"`
- **Side Effect:** Triggers group balance recalculation

### 9.4 Settlement Endpoints

#### `GET /api/groups/:groupId/settlements`

- **Description:** Get simplified settlement transactions
- **Response:** `200 OK` — `[{from: UserDTO, to: UserDTO, amount: number}]`
- **Note:** Settlements are computed on-the-fly, not persisted

---

## 10. Data Flow & Sequence of Operations

### 10.1 Create Expense — Complete Data Flow

```
Step 1: Frontend sends POST request
        ┌─────────┐    POST /api/groups/1/expenses     ┌────────────────────┐
        │ React   │ ─────────── JSON Body ────────────→│ ApiExpenseController│
        │ Frontend│                                     └─────────┬──────────┘
        └─────────┘                                               │
                                                                  │ Deserialize JSON
                                                                  ▼
Step 2: Validate group exists                           ┌──────────────────┐
        GroupService.findById(groupId) ────────────────→│  GroupServiceImpl │
                                                        └──────────────────┘
                                                                  │
Step 3: Create expense                                            ▼
        ExpenseService.createExpense(group, dto) ──────→┌──────────────────────┐
                                                        │  ExpenseServiceImpl  │
                                                        └──────────┬───────────┘
                                                                   │
Step 4: Resolve users                                              │
        User.find.byId(paidByID)                                   │
        participantIDs.stream().map(User.find::byId)               │
                                                                   │
Step 5: Select strategy                                            ▼
        SplitStrategyFactory.getStrategy(splitType) ──→ ┌──────────────────────┐
                                                        │ SplitStrategyFactory │
                                                        └──────────┬───────────┘
                                                                   │
Step 6: Calculate splits                                           ▼
        strategy.calculateSplit(paidBy, amount,          ┌──────────────────────┐
                                participants, values) ──→│ EqualSplitStrategy   │
                                                        │ (or Exact/Percentage)│
                                                        └──────────┬───────────┘
                                                                   │ Returns List<Split>
Step 7: Persist expense + splits                                   │
        expense.save()                                             │
        (CascadeType.ALL auto-saves splits)                        ▼

Step 8: Recalculate balances                            ┌──────────────────────────┐
        groupBalanceService                             │ GroupBalanceServiceImpl   │
          .recalculateGroupBalances(group)              │                          │
                                                        │ 1. DELETE old balances   │
                                                        │ 2. Scan ALL expenses     │
                                                        │ 3. addTransaction() each │
                                                        │ 4. Smart net-off logic   │
                                                        └──────────────────────────┘

Step 9: Map & respond
        ExpenseMapper.toDTO(expense) → ExpenseDTO → JSON → 201 Created
```

### 10.2 Get Group Detail — Composite Query

```
Request: GET /api/groups/1/detail
    │
    ├── GroupService.findById(1)
    │   └── Loads: Group + Members + Expenses + GroupBalances (via Ebean lazy loading)
    │
    ├── SettlementService.simplifySettlements(1)
    │   ├── GroupBalanceService.getGroupBalances(1)
    │   │   └── SELECT * FROM group_balances WHERE group_id = 1
    │   └── Run greedy settlement algorithm → List<Settlement>
    │
    └── GroupMapper.toDetailDTO(group, settlements)
        ├── members → UserMapper.toDTO each
        ├── expenses → ExpenseMapper.toDTO each
        ├── balances → GroupBalanceMapper.toDTO each
        └── settlements → SettlementMapper.toDTO each

Response: GroupDetailDTO (JSON with all sub-objects)
```

---

## 11. Core Algorithms

### 11.1 Balance Recalculation

**When triggered:** After every expense create, update, or delete.

**Algorithm:**

```
recalculateGroupBalances(group):
    1. DELETE all GroupBalance records for this group
    2. FETCH all Expenses for this group
    3. FOR each expense:
         FOR each split in expense.splits:
             IF split.user ≠ expense.paidBy:
                 addTransaction(group, debtor=split.user, creditor=paidBy, amount=split.amount)
```

**addTransaction() — Smart Net-Off Logic:**

```
addTransaction(group, debtor, creditor, amount):
    // Check for reverse balance (creditor owes debtor)
    reverseBalance = FIND WHERE group=group, creditor=debtor, debtor=creditor

    IF reverseBalance exists:
        IF reverseBalance.amount > amount:
            reverseBalance.amount -= amount     // Reduce reverse debt
        ELIF reverseBalance.amount == amount:
            DELETE reverseBalance                 // Debts cancel out
        ELSE:
            net = amount - reverseBalance.amount
            DELETE reverseBalance
            CREATE new balance(debtor, creditor, net)  // Direction flips
    ELSE:
        // Check for same-direction balance
        sameBalance = FIND WHERE group=group, creditor=creditor, debtor=debtor
        IF sameBalance exists:
            sameBalance.amount += amount          // Accumulate
        ELSE:
            CREATE new balance(debtor, creditor, amount)  // First debt
```

### 11.2 Settlement Simplification (Greedy Algorithm)

**Goal:** Minimize the number of money transfers needed to settle all debts.

**Algorithm:**

```
simplifySettlements(groupId):
    1. FETCH all GroupBalances for group

    2. COMPUTE net balance per user:
       FOR each GroupBalance(debtor, creditor, amount):
           netBalance[debtor]   -= amount
           netBalance[creditor] += amount

    3. PARTITION into two max-heaps:
       debtors   = MaxHeap of (user, |negativeBalance|)
       creditors = MaxHeap of (user, positiveBalance)

    4. GREEDY MATCHING:
       WHILE both heaps non-empty:
           topDebtor   = debtors.poll()
           topCreditor = creditors.poll()
           settlement  = min(topDebtor.amount, topCreditor.amount)

           EMIT Settlement(from=topDebtor, to=topCreditor, amount=settlement)

           remainder_debtor   = topDebtor.amount - settlement
           remainder_creditor = topCreditor.amount - settlement

           IF remainder_debtor > 0:   reinsert into debtors
           IF remainder_creditor > 0: reinsert into creditors

    5. RETURN list of settlements
```

**Complexity:** O(N log N) where N = number of users with non-zero net balance.

**Example:**

```
Group Balances:
  A owes B: ₹300
  C owes A: ₹200
  C owes B: ₹100

Net Balances:
  A: -300 + 200 = -100 (owes ₹100)
  B: +300 + 100 = +400 (owed ₹400)
  C: -200 - 100 = -300 (owes ₹300)

Settlements (simplified):
  C → B: ₹300
  A → B: ₹100
  (Only 2 transactions instead of the original 3)
```

---

## 12. Frontend Architecture

### 12.1 Page Components

| Page                | Route           | Description                                    |
|---------------------|-----------------|------------------------------------------------|
| `DashboardPage`     | `/`             | Application overview and quick stats           |
| `GroupsPage`        | `/groups`       | Grid of group cards with create dialog         |
| `GroupDetailPage`   | `/groups/:id`   | Expense table, balance table, settlement table |
| `ExpenseDetailPage` | `/expenses/:id` | Expense detail with individual split breakdown |
| `UsersPage`         | `/users`        | User list with registration form               |

### 12.2 Reusable Components

| Component           | Purpose                                              |
|---------------------|------------------------------------------------------|
| `Layout`            | Wraps all pages with consistent structure            |
| `Navbar`            | Top navigation bar                                   |
| `Sidebar`           | Side navigation menu                                 |
| `GroupCard`         | Card displaying group summary (name, member count)   |
| `ExpenseTable`      | Tabular display of expenses with edit/delete actions |
| `BalanceTable`      | Shows who owes whom within a group                   |
| `SettlementTable`   | Displays simplified settlement plan                  |
| `CreateGroupDialog` | Modal for creating new groups with member selection  |
| `AddExpenseDialog`  | Modal for adding expenses with split configuration   |

### 12.3 Service Layer

| Service Module         | Backend Endpoints                                            |
|------------------------|--------------------------------------------------------------|
| `api.ts`               | Axios instance (baseURL: `http://localhost:9000`)            |
| `userService.ts`       | `GET/POST /api/users`                                        |
| `groupService.ts`      | `GET/POST /api/groups`, `GET /api/groups/:id/detail`         |
| `expenseService.ts`    | CRUD for `/api/groups/:id/expenses`, `GET /api/expenses/:id` |
| `settlementService.ts` | `GET /api/groups/:id/settlements`                            |

### 12.4 TypeScript Type System

Frontend types mirror backend DTOs for type safety:

| TypeScript Interface | Mirrors            |
|----------------------|--------------------|
| `User`               | `UserDTO`          |
| `Group`              | `GroupDTO`         |
| `GroupDetail`        | `GroupDetailDTO`   |
| `Expense`            | `ExpenseDTO`       |
| `ExpenseDetail`      | `ExpenseDetailDTO` |
| `GroupBalance`       | `GroupBalanceDTO`  |
| `Settlement`         | `SettlementDTO`    |
| `Split`              | `SplitDTO`         |

---

## 13. Error Handling Strategy

### 13.1 Backend Error Handler

A global `ErrorHandler` class provides consistent JSON error responses:

| Exception                  | HTTP Status               | Response                               |
|----------------------------|---------------------------|----------------------------------------|
| `IllegalArgumentException` | 400 Bad Request           | `{"error": "validation message"}`      |
| `NoSuchElementException`   | 404 Not Found             | `{"error": "resource not found"}`      |
| All other exceptions       | 500 Internal Server Error | `{"error": "Internal server error"}`   |
| Client errors              | Original status           | `{"error": "message", "status": code}` |

### 13.2 Validation Rules

| Operation                   | Validation                                         |
|-----------------------------|----------------------------------------------------|
| Create User                 | Name/email must be non-empty; email must be unique |
| Create Expense (EXACT)      | Sum of exact values must equal total amount        |
| Create Expense (PERCENTAGE) | Sum of percentages must equal 100                  |
| Group operations            | Group must exist (404 if not)                      |
| Member operations           | User must exist (404 if not)                       |

---

## 14. Configuration & Deployment

### 14.1 Key Configuration (`application.conf`)

| Setting       | Value                                   |
|---------------|-----------------------------------------|
| Database URL  | `jdbc:mysql://localhost:3306/splitwise` |
| DB Driver     | `com.mysql.cj.jdbc.Driver`              |
| Ebean Models  | `models.*`                              |
| Evolutions    | Auto-apply enabled                      |
| CORS Origins  | `http://localhost:5173`                 |
| CORS Methods  | GET, POST, PUT, DELETE, PATCH, OPTIONS  |
| CSRF          | Disabled (API-only backend)             |
| Error Handler | `controllers.api.ErrorHandler`          |

### 14.2 Database Evolutions

| Version | Description                                               |
|---------|-----------------------------------------------------------|
| 1       | Create `users`, `user_groups`, `user_groups_users` tables |
| 2       | Create `expenses` and `splits` tables                     |
| 3       | Create `group_balances` table                             |
| 4       | Add `category` column to `expenses`                       |

---

## 15. Sample Walkthrough

### Scenario: Trip Expense Splitting

**Setup:** Three friends — Alice (id=1), Bob (id=2), Charlie (id=3) — go on a trip.

**Step 1: Create Users**

```
POST /api/users → {name: "Alice", email: "alice@test.com"} → {id: 1, ...}
POST /api/users → {name: "Bob", email: "bob@test.com"}     → {id: 2, ...}
POST /api/users → {name: "Charlie", email: "ch@test.com"}  → {id: 3, ...}
```

**Step 2: Create Group**

```
POST /api/groups → {name: "Trip", memberIds: [1, 2, 3]}
→ {id: 1, name: "Trip", members: [Alice, Bob, Charlie]}
```

**Step 3: Add Expenses**

| Expense | Paid By | Amount | Split Type            |
|---------|---------|--------|-----------------------|
| Hotel   | Alice   | ₹3000  | EQUAL                 |
| Dinner  | Bob     | ₹900   | EQUAL                 |
| Taxi    | Charlie | ₹600   | EXACT [200, 200, 200] |

**Step 4: Calculated Splits**

Hotel (₹3000, EQUAL, paid by Alice):

- Alice: ₹0 (payer), Bob: ₹1000, Charlie: ₹1000

Dinner (₹900, EQUAL, paid by Bob):

- Alice: ₹300, Bob: ₹0 (payer), Charlie: ₹300

Taxi (₹600, EXACT, paid by Charlie):

- Alice: ₹200, Bob: ₹200, Charlie: ₹0 (payer)

**Step 5: Computed Group Balances**

| Debtor  | Creditor | Amount |
|---------|----------|--------|
| Bob     | Alice    | ₹1000  |
| Charlie | Alice    | ₹1000  |
| Alice   | Bob      | ₹300   |
| Charlie | Bob      | ₹300   |
| Alice   | Charlie  | ₹200   |
| Bob     | Charlie  | ₹200   |

After net-off via `addTransaction()`:
| Debtor | Creditor | Amount |
|---|---|---|
| Bob | Alice | ₹500 |
| Charlie | Alice | ₹800 |
| Bob | Charlie | ₹100 |

*Explanation: Bob owes Alice ₹1000 but Alice owes Bob ₹300, net = ₹700. Then Bob owes Charlie ₹200 but Charlie owes Bob
₹300 → net: Charlie owes Bob ₹100... etc.*

**Step 6: Simplified Settlements**

Greedy algorithm output:

```
Charlie → Alice: ₹800
Bob → Alice: ₹500
Bob → Charlie: ₹100
```

Only **3 transactions** needed to settle all debts.

---

## 16. Future Enhancements

| Enhancement             | Description                                              |
|-------------------------|----------------------------------------------------------|
| **Authentication**      | Add JWT-based login/signup                               |
| **Activity Log**        | Track all expense/settlement changes                     |
| **Email Notifications** | Notify users of new expenses and settlements             |
| **Currency Support**    | Multi-currency with exchange rates                       |
| **Recurring Expenses**  | Support for recurring monthly expenses (rent, utilities) |
| **Expense Attachments** | Upload receipt photos/files                              |
| **Real-time Updates**   | WebSocket for live balance updates                       |
| **Mobile App**          | React Native or Flutter companion app                    |

---

## 17. Conclusion

The Splitwise Clone successfully implements a **full-stack group expense management system** with the following key
achievements:

1. **Clean Architecture:** Well-separated layers (Controller → Service → Model) with dependency injection
2. **Design Pattern Mastery:** Strategy, Factory, Template Method, DTO, and Mapper patterns used effectively
3. **Smart Algorithms:** Balance recalculation with net-off logic and greedy settlement optimization
4. **Type-Safe Full Stack:** TypeScript frontend types mirror Java DTOs for reliable data contracts
5. **Comprehensive API:** 12 RESTful endpoints covering complete user/group/expense/settlement lifecycle
6. **Consistent Error Handling:** Global error handler providing uniform JSON error responses

The project demonstrates proficiency in backend development (Play Framework, Ebean, Guice), frontend development (React,
TypeScript), database design (MySQL), and software design principles (SOLID, design patterns, layered architecture).

---

*End of Report*
