
# Employee Management System

A full-stack Employee Management System built using Java, Spring Boot, Angular, and MySQL. The application provides employee and department management with REST APIs and a responsive web interface.

## Technology Stack

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven
- REST APIs

### Frontend
- Angular 22
- TypeScript
- HTML5
- CSS3
- Angular Router
- HttpClient

### Database
- MySQL 8

## Project Structure

```text
Employee-Management-System/
│
├── database/
│   ├── schema.sql
│   └── V1.4.0__create_departments_and_link_employees.sql
│
├── docs/
│
├── docker/
│   ├── backend/
│   └── frontend/
│
├── employee-backend/
│
├── employee-frontend/
│
├── monitoring/
├── terraform/
├── .github/
│   └── workflows/
│
└── README.md
```

## Application Features

### Employee Management
- Create employees.
- View employee details.
- Update employee information.
- Delete employees.
- Validate employee information.
- Prevent duplicate employee codes and email addresses.
- Manage employee employment status.

### Employee Directory
- View employee records.
- Search by employee name, email, or employee code.
- Filter by department and employment status.
- Paginate employee records.
- Select page sizes of 5, 10, 20, or 50 records.

### Dashboard
- Employee management overview.
- Employee statistics.
- Dashboard navigation.

### Department Management — v1.4.0
- Create departments.
- View department records.
- Update department information.
- Delete departments when no employees are assigned.
- Assign employees using department IDs.
- View employees belonging to a department.
- Display assigned employee counts.
- Prevent deletion of departments containing employees.
- Support ACTIVE and INACTIVE department statuses.

## Database Design

The application uses a relational database structure.

### Departments Table

| Column | Description |
|---|---|
| id | Primary key |
| department_code | Unique department code |
| department_name | Department name |
| description | Department description |
| status | ACTIVE or INACTIVE |
| created_at | Creation timestamp |
| updated_at | Last update timestamp |

### Employees Table

| Column | Description |
|---|---|
| id | Primary key |
| employee_code | Unique employee code |
| first_name | Employee first name |
| last_name | Employee last name |
| email | Unique employee email |
| phone | Contact number |
| department_id | Foreign key referencing departments |
| job_title | Employee designation |
| salary | Employee salary |
| hire_date | Joining date |
| employment_status | Employee status |
| created_at | Creation timestamp |
| updated_at | Last update timestamp |

### Relationship

- One department can have multiple employees.
- Each employee is associated with a department.
- The relationship uses `employees.department_id`.
- Department deletion is restricted when employees are assigned.

## Prerequisites

Install the following software:

| Software | Version |
|---|---|
| Java JDK | 17 |
| Maven | 3.9.x |
| Node.js | 24.x |
| npm | 11.x |
| Angular CLI | 22.x |
| MySQL Server | 8.x |

## Database Setup

1. Start MySQL Server.
2. Create the application database:

```sql
CREATE DATABASE employee_management;
```

3. Create the application database user and grant the required permissions.
4. Execute `database/schema.sql` for a fresh database installation.

For an existing v1.3.0 database, use the migration file:

```text
database/V1.4.0__create_departments_and_link_employees.sql
```

Do not execute the fresh-install schema as a migration against an existing database.

## Backend Setup

Open PowerShell:

```powershell
Set-Location "employee-backend"
```

Set the database password:

```powershell
$env:DB_PASSWORD = Read-Host "Enter your MySQL password"
```

Start the backend:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

Build and verify:

```powershell
.\mvnw.cmd clean verify
```

## Frontend Setup

Open another PowerShell terminal:

```powershell
Set-Location "employee-frontend"
```

Install dependencies:

```powershell
npm.cmd install
```

Start Angular:

```powershell
npm.cmd start
```

Frontend URL:

```text
http://localhost:4200
```

Build frontend:

```powershell
npm.cmd run build
```

## REST API

Base URL:

```text
http://localhost:8080/api
```

### Employee APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees` | Get employees |
| GET | `/employees/{id}` | Get employee by ID |
| GET | `/employees/department/{departmentId}` | Get employees by department |
| POST | `/employees` | Create employee |
| PUT | `/employees/{id}` | Update employee |
| DELETE | `/employees/{id}` | Delete employee |

### Department APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/departments` | Get all departments |
| GET | `/departments/{id}` | Get department by ID |
| POST | `/departments` | Create department |
| PUT | `/departments/{id}` | Update department |
| DELETE | `/departments/{id}` | Delete department |

## Application Routes

| Route | Description |
|---|---|
| `/` | HR Management Overview |
| `/employees` | Employee Management Dashboard |
| `/employees/directory` | Employee Directory |
| `/employees/new` | Add Employee |
| `/employees/:id` | Employee Details |
| `/employees/:id/edit` | Edit Employee |
| `/departments` | Department Management |
| `/departments/:id/employees` | Department Employees |

## Configuration

Database configuration is managed through environment variables.

| Variable | Description |
|---|---|
| `DB_URL` | MySQL connection URL |
| `DB_PASSWORD` | MySQL application user password |

Default database URL:

```text
jdbc:mysql://localhost:3306/employee_management
```

Never commit database passwords, credentials, or environment-specific secrets to GitHub.

## Version History

| Version | Features |
|---|---|
| v1.0.0 | Employee creation and basic management |
| v1.1.0 | Employee details and validation |
| v1.2.0 | Employee update, deletion, and dashboard |
| v1.3.0 | Employee directory, search, filtering, and pagination |
| v1.4.0 | Department management and employee-department relationship |

## Development Roadmap

Planned improvements:

- Automated backend and frontend testing.
- Docker-based application deployment.
- Jenkins CI pipeline.
- GitHub Actions CI workflows.
- GitHub Container Registry integration.
- AWS infrastructure using Terraform.
- Application monitoring and centralized logging.
- Database backup and recovery automation.
- Deployment documentation for Windows and Linux environments.

## Important Notes

- Hibernate schema management is configured with `ddl-auto=validate`.
- Database structure changes must be handled through explicit SQL migrations.
- Keep database backups outside the Git repository.
- Validate backend APIs and frontend integration before creating a release.
- Version tags should be created only after successful end-to-end testing.
