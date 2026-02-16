# Small Business Billing & Payroll System

A full‑stack web application developed as the **ICS 499 – Software Engineering Capstone Project**.
The system is designed to help small businesses manage **workers, companies, work orders, and billing** through a modern web interface.

This iteration modernizes the original project by **migrating from XAMPP to Docker**, improving portability, reliability, and professional development practices.

---

## 🚀 Tech Stack

### Backend

* Java 21+
* Spring Boot 3
* Spring Data JPA (Hibernate)
* Maven

### Frontend

* React 18
* Create React App (`react-scripts`)
* Material UI (MUI v6)
* Axios
* React Router v6

### Database

* MySQL 8 (Dockerized)
* DBeaver (database inspection & testing)

### Tooling

* Docker Desktop
* Node.js **20 LTS**
* npm

---

## 🧱 Architecture Overview

```
React Frontend (localhost:3000)
        |
        |  REST API (JSON)
        v
Spring Boot Backend (localhost:8080)
        |
        |  JPA / Hibernate
        v
Dockerized MySQL (localhost:3307)
```

---

## 🐳 Dockerized MySQL Setup

This project **no longer uses XAMPP**. All database services run inside Docker.

### MySQL Container Configuration

* Image: `mysql:8.0`
* Container name: `payroll-mysql`
* Internal port: `3306`
* Exposed host port: `3307`

### Database Credentials

```text
Database: payrollBillingDB
Username: payroll_user
Password: payroll_pass
```

The database and user are created automatically when the container starts.

---

## 🔧 Backend Setup

### Requirements

* Java 21+
* Maven
* Docker Desktop

### Configuration (`application.properties`)

```properties
spring.datasource.url=jdbc:mysql://localhost:3307/payrollBillingDB?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=payroll_user
spring.datasource.password=payroll_pass
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
```

* `ddl-auto=update` allows Hibernate to automatically create and update tables.
* Tables are generated from JPA entities at startup.

### Running the Backend

1. Ensure Docker Desktop is running
2. Start the MySQL container
3. Run `NewbillingsystemApplication.java` from your IDE

The backend runs at:

```
http://localhost:8080
```

---

## 🖥️ Frontend Setup

### Requirements

* Node.js **20 LTS** (required)
* npm 9+

> ⚠️ Node 21+ is **not supported** by `react-scripts`.

### Install & Run

```bash
cd sbafrontend
npm install
npm start
```

The frontend runs at:

```
http://localhost:3000
```

---

## 🧪 Authentication Flow

* React frontend sends login credentials to the Spring Boot REST API
* Backend validates credentials against MySQL
* Successful login returns user data
* A **default admin user** is automatically created if none exist

---

## 🗄️ Database Inspection (DBeaver)

To connect using **DBeaver**:

* Host: `localhost`
* Port: `3307`
* Database: `payrollBillingDB`
* Username: `payroll_user`
* Password: `payroll_pass`

### Connection Settings

* Disable SSL
* Enable `allowPublicKeyRetrieval`

Hibernate‑generated tables appear under:

```
payrollBillingDB → Tables
```

---

## 📦 Key Improvements Over Previous Versions

* Migrated from XAMPP to Dockerized MySQL
* Simplified environment setup
* Improved cross‑platform portability
* Stable React 18 + MUI 6 frontend stack
* Automatic schema management via Hibernate

---

## 🛠️ Common Issues & Fixes

### ❌ MySQL Connection Refused

**Cause:** Docker container not running or incorrect port mapping.
**Fix:** Ensure Docker Desktop is running and the MySQL container exposes port `3307` → `3306`.

```bash
docker ps
```

---

### ❌ DBeaver Cannot Connect (Communications Link Failure)

**Cause:** SSL enabled or missing public key retrieval.
**Fix:** In DBeaver connection settings:

* Disable **Use SSL**
* Enable `allowPublicKeyRetrieval=true`

---

### ❌ Tables Not Appearing in DBeaver

**Cause:** DBeaver does not auto-refresh schema metadata.
**Fix:** Right-click `payrollBillingDB` → **Refresh**, then expand **Tables**.

You can also verify directly:

```sql
SHOW TABLES;
```

---

### ❌ Hibernate DDL Warnings on Startup

**Cause:** Hibernate attempting to drop constraints on non-existing tables.
**Fix:** Use the following setting during development:

```properties
spring.jpa.hibernate.ddl-auto=update
```

This prevents destructive schema operations.

---

### ❌ React Fails to Start (`react-scripts` errors)

**Cause:** Unsupported Node.js version.
**Fix:** Use **Node.js 20 LTS**. Node 21+ is not supported by Create React App.

---

### ❌ npm ERESOLVE Dependency Errors

**Cause:** Mismatched React, MUI, or router versions.
**Fix:** This project is validated with:

* React 18
* MUI v6
* React Router v6

Ensure `package.json` versions match the documented stack.

---

## 📌 Future Enhancements

* JWT‑based authentication
* Role‑based access control
* Enhanced work order lifecycle tracking
* UI/UX refinements
* Docker Compose for full stack orchestration

---

## 👥 Contributors

* **Jeremy Marks**
* **Patrick Lee**
* **Aaron Nguyen**
* **Austin Silva**

---

This project demonstrates practical full‑stack engineering skills, modern tooling, and real‑world troubleshooting across backend, frontend, and infrastructure layers.
