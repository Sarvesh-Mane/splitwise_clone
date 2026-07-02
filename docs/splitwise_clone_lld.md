# Splitwise Clone — Low-Level Design (LLD) Document

---

## 1. System Overview

This application is a **Splitwise clone** — a group expense-splitting platform that allows users to create groups, add
expenses, split costs using different strategies, track balances, and compute simplified settlements.

| Layer        | Technology                   | Port             |
|--------------|------------------------------|------------------|
| **Frontend** | React 18 + TypeScript + Vite | `localhost:5173` |
| **Backend**  | Play Framework 2.x (Java)    | `localhost:9000` |
| **ORM**      | Ebean ORM 12.16.1            | —                |
| **Database** | MySQL 8.0                    | `localhost:3306` |
| **DI**       | Google Guice                 | —                |

---

## 2. High-Level Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend (React + Vite)"]
        UI["Pages & Components"]
        SVC["Service Layer (Axios)"]
    end

    subgraph Backend["Backend (Play Framework)"]
        CTRL["API Controllers"]
        SRVC["Service Interfaces"]
        IMPL["Service Implementations"]
        MAP["Mappers"]
        DTO["DTOs"]
        STRAT["Split Strategies"]
        FACT["Strategy Factory"]
        MOD["Ebean Models"]
    end

    DB[("MySQL Database")]

    UI --> SVC
    SVC -->|"HTTP REST (JSON)"| CTRL
    CTRL --> MAP
    CTRL --> SRVC
    SRVC --> IMPL
    IMPL --> STRAT
    IMPL --> FACT
    IMPL --> MOD
    MAP --> DTO
    MOD -->|"Ebean ORM"| DB
```

---

## 3. Design Patterns Used

| Pattern                  | Where                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Purpose                                                                                            |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| **Strategy Pattern**     | [SplitStrategy](file:///Users/0867s02032sarvesh/splitwise_clone/app/strategies/SplitStrategy.java), [EqualSplitStrategy](file:///Users/0867s02032sarvesh/splitwise_clone/app/strategies/EqualSplitStrategy.java), [ExactSplitStrategy](file:///Users/0867s02032sarvesh/splitwise_clone/app/strategies/ExactSplitStrategy.java), [PercentageSplitStrategy](file:///Users/0867s02032sarvesh/splitwise_clone/app/strategies/PercentageSplitStrategy.java) | Dynamically select expense-splitting algorithm at runtime                                          |
| **Factory Pattern**      | [SplitStrategyFactory](file:///Users/0867s02032sarvesh/splitwise_clone/app/factories/SplitStrategyFactory.java)                                                                                                                                                                                                                                                                                                                                        | Instantiate the correct `SplitStrategy` based on `SplitType` enum                                  |
| **DTO Pattern**          | [dto package](file:///Users/0867s02032sarvesh/splitwise_clone/app/dto) (13 classes)                                                                                                                                                                                                                                                                                                                                                                    | Decouple API response/request shapes from internal entity models                                   |
| **Mapper Pattern**       | [mapper package](file:///Users/0867s02032sarvesh/splitwise_clone/app/mapper) (5 classes)                                                                                                                                                                                                                                                                                                                                                               | Convert between Entity ↔ DTO without polluting models                                              |
| **Template Method**      | [BaseServiceImpl](file:///Users/0867s02032sarvesh/splitwise_clone/app/serviceimpl/BaseServiceImpl.java)                                                                                                                                                                                                                                                                                                                                                | Provide generic CRUD (`save`, `findById`, `findAll`, `update`, `delete`) inherited by all services |
| **Dependency Injection** | [Module](file:///Users/0867s02032sarvesh/splitwise_clone/app/Module.java) (Guice)                                                                                                                                                                                                                                                                                                                                                                      | Bind interfaces to implementations, enabling loose coupling                                        |
| **Service-Repository**   | Service interfaces + Ebean `Finder`                                                                                                                                                                                                                                                                                                                                                                                                                    | Business logic separated from data access via Ebean finders                                        |

---

## 4. Database Schema (ER Diagram)

```mermaid
erDiagram
    USERS {
        bigint id PK
        varchar name
        varchar email
    }

    USER_GROUPS {
        bigint id PK
        varchar name
    }

    USER_GROUPS_USERS {
        bigint user_groups_id FK
        bigint users_id FK
    }

    EXPENSES {
        bigint id PK
        bigint group_id FK
        varchar expense_name
        bigint paid_by_id FK
        double amount
        varchar split_type
        varchar category
    }

    SPLITS {
        bigint id PK
        bigint expense_id FK
        bigint user_id FK
        double amount
    }

    GROUP_BALANCES {
        bigint id PK
        bigint group_id FK
        bigint debtor_id FK
        bigint creditor_id FK
        double amount
    }

    USERS ||--o{ USER_GROUPS_USERS : "belongs to"
    USER_GROUPS ||--o{ USER_GROUPS_USERS : "has members"
    USER_GROUPS ||--o{ EXPENSES : "has"
    USERS ||--o{ EXPENSES : "paid by"
    EXPENSES ||--o{ SPLITS : "split into"
    USERS ||--o{ SPLITS : "owes"
    USER_GROUPS ||--o{ GROUP_BALANCES : "tracked in"
    USERS ||--o{ GROUP_BALANCES : "debtor"
    USERS ||--o{ GROUP_BALANCES : "creditor"
```

### Table Details

| Table               | Description                                                               | Key Constraints                                                 |
|---------------------|---------------------------------------------------------------------------|-----------------------------------------------------------------|
| `users`             | Registered users                                                          | PK: `id` (auto-increment)                                       |
| `user_groups`       | Expense groups (named `user_groups` to avoid MySQL `GROUP` keyword clash) | PK: `id`                                                        |
| `user_groups_users` | Many-to-many join table for group membership                              | Composite PK: (`user_groups_id`, `users_id`), FK to both tables |
| `expenses`          | Individual expense records within a group                                 | FK: `group_id` → `user_groups`, `paid_by_id` → `users`          |
| `splits`            | Per-user split amounts for each expense                                   | FK: `expense_id` → `expenses`, `user_id` → `users`              |
| `group_balances`    | Pairwise debtor-creditor balances within a group                          | FK: `group_id`, `debtor_id`, `creditor_id` → respective tables  |

> [!NOTE]
> The `Settlement` model is **not persisted** — it is a transient in-memory POJO computed on-the-fly from `GroupBalance`
> records using a greedy algorithm.

---

## 5. Class Diagrams

### 5.1 Entity Models

```mermaid
classDiagram
    class BaseModel {
        <<abstract>>
        #Long id
        +getId() Long
        +setId(Long)
    }

    class User {
        -String name
        -String email
        +Finder~Long,User~ find$
    }

    class Group {
        -String name
        -List~Expense~ expenses
        -List~User~ members
        -List~GroupBalance~ balances
        +Finder~Long,Group~ find$
        +addMember(User)
    }

    class Expense {
        -Group group
        -User paidBy
        -String expenseName
        -Double amount
        -SplitType splitType
        -List~Split~ splits
        -Category category
        +Finder~Long,Expense~ find$
    }

    class Split {
        -User user
        -Double amount
        +Finder~Integer,Split~ find$
    }

    class GroupBalance {
        -Group group
        -User debtor
        -User creditor
        -Double amount
        +Finder~Long,GroupBalance~ find$
    }

    class Settlement {
        <<transient>>
        -User from
        -User to
        -Double amount
    }

    class UserBalance {
        <<transient>>
        -User user
        -Double amount
    }

    BaseModel <|-- User
    BaseModel <|-- Group
    BaseModel <|-- Expense
    BaseModel <|-- Split
    BaseModel <|-- GroupBalance
    Group "1" --> "*" User : members
    Group "1" --> "*" Expense : expenses
    Group "1" --> "*" GroupBalance : balances
    Expense "*" --> "1" Group : group
    Expense "*" --> "1" User : paidBy
    Expense "1" --> "*" Split : splits
    Split "*" --> "1" User : user
    GroupBalance "*" --> "1" Group : group
    GroupBalance "*" --> "1" User : debtor
    GroupBalance "*" --> "1" User : creditor
```

### 5.2 Service Layer

```mermaid
classDiagram
    class BaseService~T,ID~ {
        <<interface>>
        +save(T) T
        +findById(ID) Optional~T~
        +findAll() List~T~
        +update(T) T
        +delete(ID) void
    }

    class UserService {
        <<interface>>
        +createUser(UserCreateRequestDTO) User
        +updateUser(Long, String, String) User
    }

    class GroupService {
        <<interface>>
        +createGroup(String) Group
        +createGroupWithMembers(GroupCreateRequestDTO) Group
        +addMember(Long, User) void
        +addMemberById(Long, Long) void
        +removeMember(Long, User) void
        +getExpenses(Long) List~Expense~
    }

    class ExpenseService {
        <<interface>>
        +createExpense(Group, ExpenseRequestDTO) Expense
        +updateExpense(Long, ExpenseRequestDTO) Expense
    }

    class GroupBalanceService {
        <<interface>>
        +addTransaction(TransactionDTO) void
        +getGroupBalances(Long) List~GroupBalance~
        +recalculateGroupBalances(Group) void
    }

    class SettlementService {
        <<interface>>
        +simplifySettlements(Long) List~Settlement~
    }

    BaseService <|-- UserService
    BaseService <|-- GroupService
    BaseService <|-- ExpenseService
    BaseService <|-- GroupBalanceService
```

### 5.3 Strategy Pattern

```mermaid
classDiagram
    class SplitStrategy {
        <<interface>>
        +calculateSplit(User, Double, List~User~, List~Double~) List~Split~
    }

    class EqualSplitStrategy {
        +calculateSplit(...) List~Split~
    }

    class ExactSplitStrategy {
        +calculateSplit(...) List~Split~
    }

    class PercentageSplitStrategy {
        +calculateSplit(...) List~Split~
    }

    class SplitStrategyFactory {
        +getStrategy(SplitType)$ SplitStrategy
    }

    class SplitType {
        <<enum>>
        EQUAL
        EXACT
        PERCENTAGE
    }

    SplitStrategy <|.. EqualSplitStrategy
    SplitStrategy <|.. ExactSplitStrategy
    SplitStrategy <|.. PercentageSplitStrategy
    SplitStrategyFactory ..> SplitStrategy : creates
    SplitStrategyFactory ..> SplitType : uses
```

---

## 6. Dependency Injection (Guice Bindings)

Defined in [Module.java](file:///Users/0867s02032sarvesh/splitwise_clone/app/Module.java):

| Interface             | Bound To                  |
|-----------------------|---------------------------|
| `UserService`         | `UserServiceImpl`         |
| `GroupService`        | `GroupServiceImpl`        |
| `ExpenseService`      | `ExpenseServiceImpl`      |
| `GroupBalanceService` | `GroupBalanceServiceImpl` |
| `SettlementService`   | `SettlementServiceImpl`   |

### Injection Graph

```mermaid
graph LR
    A["ApiUserController"] --> B["UserService"]
    C["ApiGroupController"] --> D["GroupService"]
    C --> E["SettlementService"]
    F["ApiExpenseController"] --> G["ExpenseService"]
    F --> D
    H["ApiSettlementController"] --> E
    H --> D

    D["GroupServiceImpl"] --> B["UserService"]
    G["ExpenseServiceImpl"] --> I["GroupBalanceService"]
    E["SettlementServiceImpl"] --> I
```

---

## 7. REST API Specification

All routes defined in [routes](file:///Users/0867s02032sarvesh/splitwise_clone/conf/routes).

### 7.1 User APIs

| Method | Endpoint     | Controller Method                | Request Body           | Response        |
|--------|--------------|----------------------------------|------------------------|-----------------|
| `GET`  | `/api/users` | `ApiUserController.getUsers()`   | —                      | `List<UserDTO>` |
| `POST` | `/api/users` | `ApiUserController.createUser()` | `UserCreateRequestDTO` | `UserDTO` (201) |

### 7.2 Group APIs

| Method   | Endpoint                        | Controller Method                     | Request Body            | Response           |
|----------|---------------------------------|---------------------------------------|-------------------------|--------------------|
| `GET`    | `/api/groups`                   | `ApiGroupController.getGroups()`      | —                       | `List<GroupDTO>`   |
| `POST`   | `/api/groups`                   | `ApiGroupController.createGroup()`    | `GroupCreateRequestDTO` | `GroupDTO` (201)   |
| `GET`    | `/api/groups/:id`               | `ApiGroupController.getGroupById()`   | —                       | `GroupDTO`         |
| `GET`    | `/api/groups/:id/detail`        | `ApiGroupController.getGroupDetail()` | —                       | `GroupDetailDTO`   |
| `POST`   | `/api/groups/:id/members`       | `ApiGroupController.addMember()`      | `AddMemberRequestDTO`   | `"Member added"`   |
| `DELETE` | `/api/groups/:id`               | `ApiGroupController.deleteGroup()`    | —                       | `"Group deleted"`  |
| `GET`    | `/api/groups/:groupId/expenses` | `ApiGroupController.getExpenses()`    | —                       | `List<ExpenseDTO>` |

### 7.3 Expense APIs

| Method   | Endpoint                            | Controller Method                       | Request Body        | Response            |
|----------|-------------------------------------|-----------------------------------------|---------------------|---------------------|
| `GET`    | `/api/expenses/:id`                 | `ApiExpenseController.getExpenseById()` | —                   | `ExpenseDetailDTO`  |
| `POST`   | `/api/groups/:groupId/expenses`     | `ApiExpenseController.createExpense()`  | `ExpenseRequestDTO` | `ExpenseDTO` (201)  |
| `PUT`    | `/api/groups/:groupId/expenses/:id` | `ApiExpenseController.updateExpense()`  | `ExpenseRequestDTO` | `ExpenseDTO`        |
| `DELETE` | `/api/groups/:groupId/expenses/:id` | `ApiExpenseController.deleteExpense()`  | —                   | `"Expense deleted"` |

### 7.4 Settlement APIs

| Method | Endpoint                           | Controller Method                          | Request Body | Response              |
|--------|------------------------------------|--------------------------------------------|--------------|-----------------------|
| `GET`  | `/api/groups/:groupId/settlements` | `ApiSettlementController.getSettlements()` | —            | `List<SettlementDTO>` |

---

## 8. DTO Structure & Data Shapes

### Request DTOs

```mermaid
classDiagram
    class UserCreateRequestDTO {
        -String name
        -String email
    }

    class GroupCreateRequestDTO {
        -String name
        -List~Long~ memberIds
    }

    class AddMemberRequestDTO {
        -Long userId
    }

    class ExpenseRequestDTO {
        -Long paidByID
        -Double amount
        -SplitType splitType
        -List~Long~ participantIDs
        -List~Double~ values
        -String expenseName
        -Category category
    }

    class TransactionDTO {
        -Group group
        -User debtor
        -User creditor
        -Double amount
    }
```

### Response DTOs

```mermaid
classDiagram
    class UserDTO {
        -Long id
        -String name
        -String email
    }

    class GroupDTO {
        -Long id
        -String name
        -List~UserDTO~ members
    }

    class GroupDetailDTO {
        -Long id
        -String name
        -List~UserDTO~ members
        -List~ExpenseDTO~ expenses
        -List~GroupBalanceDTO~ groupBalances
        -List~SettlementDTO~ settlements
    }

    class ExpenseDTO {
        -Long id
        -String expenseName
        -Double amount
        -UserDTO paidBy
        -SplitType splitType
        -Category category
    }

    class ExpenseDetailDTO {
        -Long id
        -String expenseName
        -Double amount
        -UserDTO paidBy
        -SplitType splitType
        -Long groupId
        -List~SplitDTO~ splits
        -Category category
    }

    class SplitDTO {
        -UserDTO user
        -Double amount
    }

    class GroupBalanceDTO {
        -UserDTO debtor
        -UserDTO creditor
        -Double amount
    }

    class SettlementDTO {
        -UserDTO from
        -UserDTO to
        -Double amount
    }
```

---

## 9. Detailed Data Flow for Each Operation

### 9.1 Create User

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant CTRL as ApiUserController
    participant SVC as UserServiceImpl
    participant DB as MySQL

    FE->>CTRL: POST /api/users {name, email}
    CTRL->>CTRL: Deserialize JSON → UserCreateRequestDTO
    CTRL->>SVC: createUser(dto)
    SVC->>SVC: Validate name & email (non-empty)
    SVC->>SVC: Check duplicate email (findAll + stream filter)
    alt Validation fails
        SVC-->>CTRL: throw IllegalArgumentException
        CTRL-->>FE: 400 Bad Request {error: message}
    end
    SVC->>DB: INSERT INTO users (name, email)
    DB-->>SVC: User entity with generated id
    SVC-->>CTRL: User entity
    CTRL->>CTRL: UserMapper.toDTO(user) → UserDTO
    CTRL-->>FE: 201 Created {id, name, email}
```

**Key Logic in
** [UserServiceImpl.createUser()](file:///Users/0867s02032sarvesh/splitwise_clone/app/serviceimpl/UserServiceImpl.java#L17-L40):

1. Trim and validate `name` and `email` — throws `IllegalArgumentException` if blank
2. Check for duplicate email via `findAll().stream().anyMatch(...)` — throws if duplicate
3. Create `User` entity → `save()` → return

---

### 9.2 Create Group with Members

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant CTRL as ApiGroupController
    participant GSVC as GroupServiceImpl
    participant USVC as UserServiceImpl
    participant DB as MySQL

    FE->>CTRL: POST /api/groups {name, memberIds: [1,2,3]}
    CTRL->>CTRL: Deserialize → GroupCreateRequestDTO
    CTRL->>GSVC: createGroupWithMembers(dto)
    GSVC->>GSVC: createGroup(name)
    GSVC->>DB: INSERT INTO user_groups (name)
    DB-->>GSVC: Group with id

    loop For each memberId in memberIds
        GSVC->>USVC: findById(userId)
        USVC->>DB: SELECT * FROM users WHERE id = ?
        DB-->>USVC: User entity
        GSVC->>GSVC: addMember(groupId, user)
        GSVC->>DB: INSERT INTO user_groups_users (group_id, user_id)
    end

    GSVC->>DB: Re-fetch group (with members)
    DB-->>GSVC: Group with populated members list
    GSVC-->>CTRL: Group entity
    CTRL->>CTRL: GroupMapper.toDTO(group) → GroupDTO
    CTRL-->>FE: 201 Created {id, name, members: [...]}
```

**Key Logic in
** [GroupServiceImpl.createGroupWithMembers()](file:///Users/0867s02032sarvesh/splitwise_clone/app/serviceimpl/GroupServiceImpl.java#L34-L49):

1. Create the group row first
2. Iterate over `memberIds`, look up each user, skip nulls
3. Call `addMember()` which loads group by ID, appends user to `members` list, saves
4. Re-fetch group to populate lazy-loaded members for the response

---

### 9.3 Add Member to Existing Group

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant CTRL as ApiGroupController
    participant GSVC as GroupServiceImpl
    participant USVC as UserServiceImpl
    participant DB as MySQL

    FE->>CTRL: POST /api/groups/:id/members {userId}
    CTRL->>CTRL: Deserialize → AddMemberRequestDTO
    CTRL->>GSVC: addMemberById(groupId, userId)
    GSVC->>USVC: findById(userId)
    alt User not found
        USVC-->>GSVC: throw NoSuchElementException
        GSVC-->>CTRL: Exception propagated
        CTRL-->>FE: 404 Not Found
    end
    GSVC->>DB: SELECT group WHERE id = groupId
    GSVC->>GSVC: group.addMember(user)
    GSVC->>DB: INSERT INTO user_groups_users
    GSVC-->>CTRL: void
    CTRL-->>FE: 200 OK "Member added"
```

---

### 9.4 Create Expense (Core Operation) ⭐

This is the most complex operation, involving the **Strategy Pattern** and **balance recalculation**.

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant CTRL as ApiExpenseController
    participant GSVC as GroupServiceImpl
    participant ESVC as ExpenseServiceImpl
    participant FACT as SplitStrategyFactory
    participant STRAT as SplitStrategy
    participant GBSVC as GroupBalanceServiceImpl
    participant DB as MySQL

    FE->>CTRL: POST /api/groups/:groupId/expenses
    Note right of FE: {expenseName, paidByID, amount,<br/>splitType, participantIDs, values, category}

    CTRL->>GSVC: findById(groupId)
    alt Group not found
        GSVC-->>CTRL: throw NoSuchElementException
        CTRL-->>FE: 404
    end

    CTRL->>CTRL: Deserialize → ExpenseRequestDTO
    CTRL->>ESVC: createExpense(group, dto)

    %% Step 1: Resolve participants
    ESVC->>DB: SELECT user WHERE id IN (participantIDs)
    DB-->>ESVC: List of User entities

    %% Step 2: Strategy selection
    ESVC->>FACT: getStrategy(splitType)
    alt EQUAL
        FACT-->>ESVC: EqualSplitStrategy
    else EXACT
        FACT-->>ESVC: ExactSplitStrategy
    else PERCENTAGE
        FACT-->>ESVC: PercentageSplitStrategy
    end

    %% Step 3: Calculate splits
    ESVC->>STRAT: calculateSplit(paidBy, amount, participants, values)
    STRAT-->>ESVC: List<Split>

    %% Step 4: Save expense + splits
    ESVC->>DB: INSERT INTO expenses (...) + INSERT INTO splits (...)
    DB-->>ESVC: Expense with generated id

    %% Step 5: Recalculate group balances
    ESVC->>GBSVC: recalculateGroupBalances(group)
    GBSVC->>DB: DELETE FROM group_balances WHERE group = ?
    GBSVC->>DB: SELECT * FROM expenses WHERE group = ?
    DB-->>GBSVC: All expenses for group

    loop For each expense
        loop For each split (where split.user ≠ paidBy)
            GBSVC->>GBSVC: addTransaction(TransactionDTO)
            Note right of GBSVC: Smart merge: check for<br/>reverse balance, net out,<br/>or create/update
            GBSVC->>DB: INSERT/UPDATE/DELETE group_balances
        end
    end

    ESVC-->>CTRL: Expense entity
    CTRL->>CTRL: ExpenseMapper.toDTO(expense) → ExpenseDTO
    CTRL-->>FE: 201 Created {id, expenseName, amount, paidBy, splitType, category}
```

#### Split Calculation Details

| Strategy       | Algorithm                                                                                   | Validation                            |
|----------------|---------------------------------------------------------------------------------------------|---------------------------------------|
| **EQUAL**      | `splitAmount = amount / participants.size()`. Payer's split = `0.0`, others = `splitAmount` | None                                  |
| **EXACT**      | Each participant gets their specified exact `values[i]`. Payer's split = `0.0`              | Sum of values must equal `amount`     |
| **PERCENTAGE** | Each participant gets `amount × percentages[i] / 100`                                       | Sum of percentages must equal `100.0` |

> [!IMPORTANT]
> In **EqualSplitStrategy** and **ExactSplitStrategy**, the payer's split amount is set to `0.0` (they don't owe
> themselves). In **PercentageSplitStrategy**, the payer's split is **not** zero'd out — they get their percentage
> share.

#### Balance Recalculation Algorithm

In [GroupBalanceServiceImpl.recalculateGroupBalances()](file:///Users/0867s02032sarvesh/splitwise_clone/app/serviceimpl/GroupBalanceServiceImpl.java#L66-L86):

1. **Delete** all existing `GroupBalance` records for the group
2. **Re-scan** every expense in the group
3. For each expense, for each split where `split.user ≠ paidBy`:
    - Create a `TransactionDTO(group, debtor=split.user, creditor=paidBy, amount=split.amount)`
    - Call `addTransaction()`

The [addTransaction()](file:///Users/0867s02032sarvesh/splitwise_clone/app/serviceimpl/GroupBalanceServiceImpl.java#L21-L53)
method performs **smart net-off logic**:

```
if reverse balance exists (creditor↔debtor swapped):
    if reverse.amount > transaction.amount:
        reverse.amount -= transaction.amount     // reduce reverse
    elif reverse.amount == transaction.amount:
        DELETE reverse                            // they cancel out
    else:
        DELETE reverse
        CREATE new balance with (transaction.amount - reverse.amount)
else:
    if same-direction balance exists:
        balance.amount += transaction.amount      // accumulate
    else:
        CREATE new GroupBalance                   // first debt
```

---

### 9.5 Update Expense

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant CTRL as ApiExpenseController
    participant ESVC as ExpenseServiceImpl
    participant GBSVC as GroupBalanceServiceImpl
    participant DB as MySQL

    FE->>CTRL: PUT /api/groups/:groupId/expenses/:id
    CTRL->>ESVC: updateExpense(id, dto)
    ESVC->>DB: SELECT expense WHERE id = ?
    ESVC->>ESVC: Resolve new paidBy, participants
    ESVC->>ESVC: SplitStrategyFactory.getStrategy(splitType)
    ESVC->>ESVC: strategy.calculateSplit(...)

    %% Delete old splits
    loop For each old split
        ESVC->>DB: DELETE FROM splits WHERE id = ?
    end

    %% Update expense fields
    ESVC->>DB: UPDATE expenses SET ...
    ESVC->>GBSVC: recalculateGroupBalances(group)
    Note right of GBSVC: Full wipe & rebuild<br/>(same as create flow)
    ESVC-->>CTRL: Updated Expense
    CTRL-->>FE: 200 OK ExpenseDTO
```

**Key Logic in
** [ExpenseServiceImpl.updateExpense()](file:///Users/0867s02032sarvesh/splitwise_clone/app/serviceimpl/ExpenseServiceImpl.java#L56-L89):

1. Find existing expense by ID
2. Delete all old `Split` entities individually
3. Recalculate new splits using the (possibly new) strategy
4. Update expense fields → `expense.update()`
5. Trigger full `recalculateGroupBalances()` for the group

---

### 9.6 Delete Expense

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant CTRL as ApiExpenseController
    participant ESVC as ExpenseServiceImpl
    participant GBSVC as GroupBalanceServiceImpl
    participant DB as MySQL

    FE->>CTRL: DELETE /api/groups/:groupId/expenses/:id
    CTRL->>ESVC: delete(id)
    ESVC->>DB: SELECT expense WHERE id = ?
    ESVC->>DB: DELETE expense (CASCADE deletes splits)
    ESVC->>GBSVC: recalculateGroupBalances(group)
    Note right of GBSVC: Recalculate from<br/>remaining expenses
    ESVC-->>CTRL: void
    CTRL-->>FE: 200 OK "Expense deleted"
```

---

### 9.7 Get Group Detail (Composite Query)

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant CTRL as ApiGroupController
    participant GSVC as GroupServiceImpl
    participant SSVC as SettlementServiceImpl
    participant GBSVC as GroupBalanceServiceImpl
    participant DB as MySQL

    FE->>CTRL: GET /api/groups/:id/detail
    CTRL->>GSVC: findById(id)
    GSVC->>DB: SELECT group + members + expenses + balances
    DB-->>GSVC: Group entity (with lazy-loaded relations)
    GSVC-->>CTRL: Group

    CTRL->>SSVC: simplifySettlements(id)
    SSVC->>GBSVC: getGroupBalances(id)
    GBSVC->>DB: SELECT * FROM group_balances WHERE group_id = ?
    DB-->>GBSVC: List<GroupBalance>
    GBSVC-->>SSVC: balances

    SSVC->>SSVC: Compute net balances per user
    SSVC->>SSVC: Greedy settlement algorithm
    SSVC-->>CTRL: List<Settlement>

    CTRL->>CTRL: GroupMapper.toDetailDTO(group, settlements)
    Note right of CTRL: Aggregates: members,<br/>expenses, balances, settlements

    CTRL-->>FE: 200 OK GroupDetailDTO
```

---

### 9.8 Get Simplified Settlements (Algorithm Deep-Dive)

The settlement simplification
in [SettlementServiceImpl.simplifySettlements()](file:///Users/0867s02032sarvesh/splitwise_clone/app/serviceimpl/SettlementServiceImpl.java#L25-L72)
uses a **greedy algorithm with max-heaps**:

```mermaid
flowchart TD
    A["Fetch all GroupBalances for group"] --> B["Compute net balance per user"]
    B --> C{"For each user"}
    C -->|"net < 0"| D["Add to debtors MaxHeap<br/>(absolute value)"]
    C -->|"net > 0"| E["Add to creditors MaxHeap"]
    C -->|"net = 0"| F["Skip (settled)"]

    D --> G["Greedy Settlement Loop"]
    E --> G

    G --> H["Poll top debtor & top creditor"]
    H --> I["settlementAmount = min(debtor.amount, creditor.amount)"]
    I --> J["Create Settlement(debtor → creditor, amount)"]
    J --> K{"Remaining balance?"}
    K -->|"creditor has remainder"| L["Re-insert creditor into heap"]
    K -->|"debtor has remainder"| M["Re-insert debtor into heap"]
    K -->|"Both zero"| N["Continue"]
    L --> G
    M --> G
    N --> G
    G -->|"Heaps empty"| O["Return List of Settlements"]
```

**Algorithm Steps:**

1. **Net balances**: For each `GroupBalance(debtor, creditor, amount)`:
    - `netBalance[debtor] -= amount`
    - `netBalance[creditor] += amount`
2. **Partition**: Users with negative net → debtors heap (max by absolute value), positive → creditors heap
3. **Greedy match**: Pair the largest debtor with the largest creditor, settle `min(debt, credit)`, re-insert remainder
4. This minimizes the number of transactions needed

---

### 9.9 Delete Group

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant CTRL as ApiGroupController
    participant GSVC as GroupServiceImpl
    participant DB as MySQL

    FE->>CTRL: DELETE /api/groups/:id
    CTRL->>GSVC: delete(id)
    GSVC->>DB: SELECT group WHERE id = ?
    GSVC->>DB: DELETE group (CASCADE: expenses, splits removed)
    GSVC-->>CTRL: void
    CTRL-->>FE: 200 OK "Group deleted"
```

---

## 10. Error Handling

The custom [ErrorHandler](file:///Users/0867s02032sarvesh/splitwise_clone/app/controllers/api/ErrorHandler.java)
implements `HttpErrorHandler` and provides consistent JSON error responses:

| Exception Type             | HTTP Status                   | Response Body                              |
|----------------------------|-------------------------------|--------------------------------------------|
| `IllegalArgumentException` | **400** Bad Request           | `{"error": "<message>"}`                   |
| `NoSuchElementException`   | **404** Not Found             | `{"error": "<message>"}`                   |
| Any other `Throwable`      | **500** Internal Server Error | `{"error": "Internal server error"}`       |
| Client errors (4xx)        | Original status code          | `{"error": "<message>", "status": <code>}` |

> [!NOTE]
> The handler unwraps `CompletionException` (one level) to find the root cause, since Play Framework wraps exceptions in
`CompletionStage`.

---

## 11. Frontend Architecture

### 11.1 Routing

Defined in [App.tsx](file:///Users/0867s02032sarvesh/splitwise_clone/frontend/src/App.tsx):

| Route           | Page Component      | Purpose                                           |
|-----------------|---------------------|---------------------------------------------------|
| `/`             | `DashboardPage`     | Overview/landing page                             |
| `/groups`       | `GroupsPage`        | List all groups                                   |
| `/groups/:id`   | `GroupDetailPage`   | Group detail with expenses, balances, settlements |
| `/expenses/:id` | `ExpenseDetailPage` | Individual expense detail with splits             |
| `/users`        | `UsersPage`         | User management                                   |

### 11.2 Component Hierarchy

```mermaid
graph TD
    App --> Layout
    Layout --> Navbar
    Layout --> Sidebar
    Layout --> Outlet["Router Outlet"]

    Outlet --> DashboardPage
    Outlet --> GroupsPage
    Outlet --> GroupDetailPage
    Outlet --> ExpenseDetailPage
    Outlet --> UsersPage

    GroupsPage --> GroupCard
    GroupsPage --> CreateGroupDialog

    GroupDetailPage --> ExpenseTable
    GroupDetailPage --> BalanceTable
    GroupDetailPage --> SettlementTable
    GroupDetailPage --> AddExpenseDialog
```

### 11.3 Frontend → Backend Data Flow

```mermaid
graph LR
    subgraph Frontend
        Pages["Page Components"]
        Services["Service Layer"]
        AxiosInst["Axios Instance<br/>(baseURL: localhost:9000)"]
    end

    subgraph Backend
        Routes["Play Routes"]
        Controllers["API Controllers"]
    end

    Pages -->|"call"| Services
    Services -->|"HTTP request"| AxiosInst
    AxiosInst -->|"REST API"| Routes
    Routes -->|"dispatch"| Controllers
    Controllers -->|"JSON response"| AxiosInst
    AxiosInst -->|"response.data"| Services
    Services -->|"typed data"| Pages
```

### 11.4 Frontend Type System

TypeScript interfaces mirror the backend DTOs:

| Frontend Type   | Backend DTO        |
|-----------------|--------------------|
| `User`          | `UserDTO`          |
| `Group`         | `GroupDTO`         |
| `GroupDetail`   | `GroupDetailDTO`   |
| `Expense`       | `ExpenseDTO`       |
| `ExpenseDetail` | `ExpenseDetailDTO` |
| `GroupBalance`  | `GroupBalanceDTO`  |
| `Settlement`    | `SettlementDTO`    |
| `Split`         | `SplitDTO`         |

---

## 12. Data Transformation Pipeline

For every API response, data flows through a consistent transformation pipeline:

```
Entity (Ebean Model)
    ↓ Mapper.toDTO()
DTO (Data Transfer Object)
    ↓ Json.toJson()
JSON String
    ↓ HTTP Response
Frontend Axios
    ↓ response.data
TypeScript Interface
    ↓ React State
UI Render
```

### Mapper Responsibilities

| Mapper                                                                                                   | From           | To                                | Notes                                                                                          |
|----------------------------------------------------------------------------------------------------------|----------------|-----------------------------------|------------------------------------------------------------------------------------------------|
| [UserMapper](file:///Users/0867s02032sarvesh/splitwise_clone/app/mapper/UserMapper.java)                 | `User`         | `UserDTO`                         | Direct field copy                                                                              |
| [GroupMapper](file:///Users/0867s02032sarvesh/splitwise_clone/app/mapper/GroupMapper.java)               | `Group`        | `GroupDTO` / `GroupDetailDTO`     | Maps members via `UserMapper`, expenses via `ExpenseMapper`, balances via `GroupBalanceMapper` |
| [ExpenseMapper](file:///Users/0867s02032sarvesh/splitwise_clone/app/mapper/ExpenseMapper.java)           | `Expense`      | `ExpenseDTO` / `ExpenseDetailDTO` | `toDetailDTO` includes splits and groupId                                                      |
| [GroupBalanceMapper](file:///Users/0867s02032sarvesh/splitwise_clone/app/mapper/GroupBalanceMapper.java) | `GroupBalance` | `GroupBalanceDTO`                 | Maps nested debtor/creditor via `UserMapper`                                                   |
| [SettlementMapper](file:///Users/0867s02032sarvesh/splitwise_clone/app/mapper/SettlementMapper.java)     | `Settlement`   | `SettlementDTO`                   | Maps nested from/to via `UserMapper`                                                           |

---

## 13. Enumerations

### SplitType ([SplitType.java](file:///Users/0867s02032sarvesh/splitwise_clone/app/enums/SplitType.java))

| Value        | Description                                      |
|--------------|--------------------------------------------------|
| `EQUAL`      | Split equally among all participants             |
| `EXACT`      | Each participant's exact amount is specified     |
| `PERCENTAGE` | Each participant's percentage share is specified |

### Category ([Category.java](file:///Users/0867s02032sarvesh/splitwise_clone/app/enums/Category.java))

| Value             |
|-------------------|
| `FOOD`            |
| `TRAVEL`          |
| `RENT`            |
| `UTILITIES`       |
| `ENTERTAINMENT`   |
| `OTHER` (default) |

---

## 14. Database Evolutions

Managed via Play Evolutions with `autoApply=true`:

| Evolution | Changes                                                         | File                                                                                   |
|-----------|-----------------------------------------------------------------|----------------------------------------------------------------------------------------|
| **1**     | Create `users`, `user_groups`, `user_groups_users` (join table) | [1.sql](file:///Users/0867s02032sarvesh/splitwise_clone/conf/evolutions/default/1.sql) |
| **2**     | Create `expenses` and `splits` tables with FK constraints       | [2.sql](file:///Users/0867s02032sarvesh/splitwise_clone/conf/evolutions/default/2.sql) |
| **3**     | Create `group_balances` table (debtor-creditor pairs)           | [3.sql](file:///Users/0867s02032sarvesh/splitwise_clone/conf/evolutions/default/3.sql) |
| **4**     | Add `category` column to `expenses` (default `'OTHER'`)         | [4.sql](file:///Users/0867s02032sarvesh/splitwise_clone/conf/evolutions/default/4.sql) |

---

## 15. CORS & Security Configuration

Defined in [application.conf](file:///Users/0867s02032sarvesh/splitwise_clone/conf/application.conf):

| Setting         | Value                                    |
|-----------------|------------------------------------------|
| Allowed Origins | `http://localhost:5173`                  |
| Allowed Methods | `GET, POST, PUT, DELETE, PATCH, OPTIONS` |
| Allowed Headers | `Accept, Content-Type, Authorization`    |
| Credentials     | `true`                                   |
| CSRF            | **Disabled** (`CSRFFilter` removed)      |

---

## 16. Complete End-to-End Example: Adding a ₹900 Dinner Expense Split Equally Among 3 Users

```
1. Frontend: User clicks "Add Expense" on Group Detail page
   → AddExpenseDialog opens

2. User fills form:
   - Expense Name: "Dinner"
   - Amount: 900
   - Paid By: User A (id=1)
   - Split Type: EQUAL
   - Participants: User A (id=1), User B (id=2), User C (id=3)
   - Category: FOOD

3. Frontend → POST /api/groups/1/expenses
   Body: {
     "expenseName": "Dinner",
     "paidByID": 1,
     "amount": 900,
     "splitType": "EQUAL",
     "participantIDs": [1, 2, 3],
     "values": [],
     "category": "FOOD"
   }

4. ApiExpenseController: Validate group exists → call ExpenseServiceImpl

5. ExpenseServiceImpl:
   a. Lookup User A (paidBy), Users A/B/C (participants)
   b. SplitStrategyFactory.getStrategy(EQUAL) → EqualSplitStrategy
   c. EqualSplitStrategy.calculateSplit():
      - splitAmount = 900 / 3 = 300
      - Split(UserA, 0.0)   ← payer, owes nothing to self
      - Split(UserB, 300.0)  ← owes ₹300
      - Split(UserC, 300.0)  ← owes ₹300
   d. Save Expense + 3 Split records
   e. Trigger recalculateGroupBalances(group)

6. GroupBalanceServiceImpl.recalculateGroupBalances():
   a. DELETE all existing GroupBalances for this group
   b. Re-scan all expenses:
      - For Dinner: skip UserA split (amount=0), process:
        - TransactionDTO(debtor=UserB, creditor=UserA, amount=300)
        - TransactionDTO(debtor=UserC, creditor=UserA, amount=300)
   c. addTransaction results:
      - GroupBalance(debtor=UserB, creditor=UserA, amount=300) → SAVED
      - GroupBalance(debtor=UserC, creditor=UserA, amount=300) → SAVED

7. Response → 201 Created with ExpenseDTO

8. Frontend: GroupDetailPage reloads, showing:
   - Expense: "Dinner - ₹900 (paid by User A, EQUAL)"
   - Balances: "User B owes User A ₹300", "User C owes User A ₹300"
   - Settlements: "User B → User A: ₹300", "User C → User A: ₹300"
```

---

## 17. File Structure Summary

```
splitwise_clone/
├── app/
│   ├── Module.java                          # Guice DI bindings
│   ├── controllers/api/
│   │   ├── ApiUserController.java           # User CRUD endpoints
│   │   ├── ApiGroupController.java          # Group management + detail
│   │   ├── ApiExpenseController.java        # Expense CRUD endpoints
│   │   ├── ApiSettlementController.java     # Settlement computation endpoint
│   │   └── ErrorHandler.java               # Global JSON error handler
│   ├── dto/                                 # 13 Data Transfer Objects
│   ├── enums/
│   │   ├── SplitType.java                   # EQUAL | EXACT | PERCENTAGE
│   │   └── Category.java                   # FOOD | TRAVEL | RENT | ...
│   ├── factories/
│   │   └── SplitStrategyFactory.java        # Factory for split strategies
│   ├── mapper/                              # 5 Entity→DTO mappers
│   ├── models/
│   │   ├── BaseModel.java                   # Abstract base with id
│   │   ├── User.java                        # @Entity → users
│   │   ├── Group.java                       # @Entity → user_groups
│   │   ├── Expense.java                     # @Entity → expenses
│   │   ├── Split.java                       # @Entity → splits
│   │   ├── GroupBalance.java                # @Entity → group_balances
│   │   ├── Settlement.java                  # Transient POJO (not persisted)
│   │   └── UserBalance.java                 # Transient POJO for settlements
│   ├── services/                            # 6 Service interfaces
│   ├── serviceimpl/                         # 6 Service implementations
│   └── strategies/
│       ├── SplitStrategy.java               # Strategy interface
│       ├── EqualSplitStrategy.java          # amount / n
│       ├── ExactSplitStrategy.java          # user-specified amounts
│       └── PercentageSplitStrategy.java     # percentage-based
├── conf/
│   ├── application.conf                     # DB, CORS, filters config
│   ├── routes                               # API route definitions
│   └── evolutions/default/                  # 4 SQL evolution scripts
├── frontend/src/
│   ├── App.tsx                              # Router setup
│   ├── components/                          # 9 React components + ui/
│   ├── pages/                               # 5 page components
│   ├── services/                            # 5 API service modules
│   └── types/                               # 8 TypeScript interfaces
└── build.sbt                                # SBT build with PlayJava + Ebean
```
