# Employee Management System — Local Setup Log

A record of getting the Employee Management System (Spring Boot + React + MySQL) running on a new Windows PC.

## 1. Prerequisites installed

| Tool | Version | Notes |
|---|---|---|
| Java (JDK) | 17.x | Project requires exactly Java 17 (`pom.xml`). Installed alongside existing JDK 26; `JAVA_HOME` set to point at 17 for this project. |
| MySQL Server | 8.0.46 | Installed via MySQL Installer — Development Computer config, TCP/IP port 3306, root account created with a strengthened password. |
| Node.js | v24.18.0 LTS | Installed via the plain Windows `.msi` installer (not a version manager). npm 11.16.0 came bundled. |

## 2. Issues hit and fixed along the way

- **MySQL Installer — weak password warning:** strengthened the root password before continuing.
- **Extra user dialog (`JasonRoy`):** cancelled — decided to use the `root` account only, since the project's default config already expects `root`.
- **`mysql` command not recognized:** MySQL's `bin` folder wasn't in the system PATH. Fixed by adding `C:\Program Files\MySQL\MySQL Server 8.0\bin` to the PATH environment variable (System variables → Path → New), then reopening the terminal.
- **`npm -v` blocked in PowerShell** (`PSSecurityException` / script execution disabled): fixed by running, in an admin PowerShell window:
  ```
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
- **`mysql -u rooot -p` access denied:** typo in the username (`rooot` instead of `root`) — not an actual config issue.
- **`mvng spring-boot:run` not recognized:** typo — correct command is `mvnw` (Maven Wrapper), and it must be run from inside the `employee-managment` folder (where `pom.xml` and `mvnw` actually live), not the parent `backend` folder.
- **Backend startup — `Access denied for user 'root'@'localhost'`:** the password in `application.properties` (`spring.datasource.password`) didn't match the actual MySQL root password. Fixed by updating it to match.
- **Frontend — `Module not found: Cannot find file: 'app.css'`:** case-sensitivity mismatch between the import in `App.js` (`./app.css`, lowercase) and the actual file on disk (`App.css`, capital A). Windows' filesystem ignores case but Create React App's build tool enforces it. Fixed by correcting the import to `./App.css`.

## 3. Database setup

```sql
CREATE DATABASE employeeManagement;
```
No tables created manually — Hibernate auto-generates the `employee` table on first successful backend startup (`spring.jpa.hibernate.ddl-auto=update`).

## 4. Running the project (the steady-state process, going forward)

**Terminal 1 — backend:**
```
cd "employeemangement - backend\employee-managment"
mvnw spring-boot:run
```
Wait for `Started EmployeeManagementApplication...`. Leave this terminal open — it's the live server.

**Terminal 2 — frontend:**
```
cd employeefrondend
npm install   # first time only
npm start
```
Opens `http://localhost:3000` automatically.

## 5. Result

Successfully added an employee (Jason Akbar) through the UI and confirmed it round-tripped through the full stack — React form → axios POST → Spring Boot controller/service/repository → Hibernate → MySQL `employee` table → back to the list view.

## 6. Key concepts clarified today

- **Where the data lives:** MySQL's own data directory (`C:\ProgramData\MySQL\MySQL Server 8.0\Data\employeeManagement\`) — not in the project's source code or the local Git repo. The repo only holds code; the database holds data. They're separate by design.
- **How the frontend gets data:** one-time fetch on page load (`useEffect` in `ListEmployee.jsx`), not real-time. Re-fetches only on navigation back to that page, not automatically.
- **Why a backend is needed at all:** browsers can't open direct SQL connections (no driver, and it would expose DB credentials publicly). The backend is the only trusted party that holds DB credentials and translates HTTP/JSON requests into SQL.