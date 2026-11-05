

\# Employee Management System — Release v1.7.0



A full-stack Employee Management System built using Java, Spring Boot, Angular, and MySQL. This release introduces User Account Management, authentication, role-based access control, and secure account administration.



\## Release Information



| Item | Details |

|---|---|

| Project | Employee Management System |

| Release Version | v1.7.0 |

| Release Name | User Account Management |

| Backend | Java 17, Spring Boot |

| Frontend | Angular 22 |

| Database | MySQL 8 |

| API Architecture | REST APIs |

| Authentication | JWT |

| Password Encryption | BCrypt |



\## Technology Stack



\### Backend

\- Java 17

\- Spring Boot

\- Spring Data JPA

\- Hibernate

\- Spring Security

\- JWT Authentication

\- BCrypt Password Hashing

\- Maven

\- REST APIs



\### Frontend

\- Angular 22

\- TypeScript

\- HTML5

\- CSS3

\- Angular Router

\- HttpClient

\- HTTP Interceptors

\- Route Guards



\### Database

\- MySQL 8

\- Relational database design

\- Foreign key constraints

\- SQL migration scripts



\## Project Structure



```text

Employee-Management-System/

│

├── database/

│   ├── schema.sql

│   ├── V1.4.0\_\_create\_departments\_and\_link\_employees.sql

│   ├── V1.5.0\_\_add\_employee\_exit\_details.sql

│   ├── databaseV1.6.0\_\_add\_user\_authentication.sql

│   └── V1.7.0\_\_add\_forced\_password\_change.sql

│

├── docs/

│   └── RELEASE\_NOTES\_v1.7.0.md

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

├── postman/

└── README.md

```



\## Application Features



\### 1. Employee Management



\- Create employees.

\- View employee details.

\- Update employee information.

\- Delete employee records.

\- Validate employee information.

\- Prevent duplicate employee codes and email addresses.

\- Manage employee employment status.



\### 2. Employee Directory



\- View employee records.

\- Search by employee name, email, or employee code.

\- Filter by department and employment status.

\- Paginate employee records.

\- Select page sizes of 5, 10, 20, or 50 records.



\### 3. Dashboard



\- Employee management overview.

\- Employee statistics.

\- Dashboard navigation.

\- Role-based access to management areas.



\### 4. Department Management — v1.4.0



\- Create departments.

\- View department records.

\- Update department information.

\- Delete departments when no employees are assigned.

\- Assign employees using department IDs.

\- View employees belonging to a department.

\- Display assigned employee counts.

\- Prevent deletion of departments containing employees.

\- Support ACTIVE and INACTIVE department statuses.



\### 5. Employee Lifecycle Management — v1.5.0



\- Manage employee employment lifecycle.

\- Support employee termination.

\- Record employee exit details.

\- Store exit date and exit reason.

\- Track employee employment status.

\- Prevent inactive or terminated employees from authenticating.



\### 6. Authentication and Role-Based Access Control — v1.6.0



\- Secure login using username or email.

\- JWT-based authentication.

\- BCrypt password hashing.

\- Stateless backend authentication.

\- Role-based authorization.

\- Protected backend APIs.

\- Protected Angular routes.

\- JWT HTTP interceptor.

\- Authentication guards.

\- Secure logout and session handling.

\- Login rate limiting.



\### 7. User Account Management — v1.7.0



\- ADMIN-only User Management screen.

\- Create user accounts for HR and EMPLOYEE roles.

\- View registered user accounts.

\- Display total, active, and inactive account statistics.

\- Assign user accounts to existing employee records.

\- Prevent duplicate usernames and email addresses.

\- Prevent multiple accounts for the same employee.

\- Prevent account creation for inactive employees.

\- Prevent creation of additional ADMIN accounts through User Management.

\- Activate and deactivate user accounts.

\- Reset user passwords.

\- Force users to change passwords after account creation.

\- Force users to change passwords after password reset.

\- Prevent users from reusing their current password during password change.

\- Prevent administrators from deactivating their own account.

\- Prevent deactivation of the last active ADMIN account.

\- Restrict inactive user accounts from authentication.

\- Restrict accounts linked to inactive or terminated employees from authentication.



\## User Roles and Permissions



| Role | Access |

|---|---|

| ADMIN | User Account Management and authorized management operations |

| HR | Employee and department management operations permitted to HR |

| EMPLOYEE | Authorized employee-facing operations |



Access is enforced through backend authorization and frontend route/navigation restrictions. Frontend restrictions alone are not considered security controls.



\## Database Design



The application uses a relational database structure.



\### Departments Table



| Column | Description |

|---|---|

| id | Primary key |

| department\_code | Unique department code |

| department\_name | Department name |

| description | Department description |

| status | ACTIVE or INACTIVE |

| created\_at | Creation timestamp |

| updated\_at | Last update timestamp |



\### Employees Table



| Column | Description |

|---|---|

| id | Primary key |

| employee\_code | Unique employee code |

| first\_name | Employee first name |

| last\_name | Employee last name |

| email | Unique employee email |

| phone | Contact number |

| department\_id | Foreign key referencing departments |

| job\_title | Employee designation |

| salary | Employee salary |

| hire\_date | Joining date |

| employment\_status | Employee employment status |

| exit\_date | Employee exit date, when applicable |

| exit\_reason | Employee exit reason, when applicable |

| created\_at | Creation timestamp |

| updated\_at | Last update timestamp |



\### Users Table



| Column | Description |

|---|---|

| id | Primary key |

| employee\_id | Optional foreign key referencing employees |

| username | Unique login username |

| email | Unique login email |

| password\_hash | BCrypt encrypted password |

| role | ADMIN, HR, or EMPLOYEE |

| status | ACTIVE or INACTIVE |

| must\_change\_password | Indicates whether password change is required |

| created\_at | Account creation timestamp |

| updated\_at | Last account update timestamp |



\### Database Relationships



\- One department can have multiple employees.

\- Each employee is associated with a department.

\- An employee can have an associated user account.

\- A user account can exist without an employee association for administrative access.

\- Foreign key constraints maintain database relationships.



\## Prerequisites



| Software | Version |

|---|---|

| Java JDK | 17 |

| Maven | 3.9.x |

| Node.js | 24.x |

| npm | 11.x |

| Angular CLI | 22.x |

| MySQL Server | 8.x |



\## Database Setup



1\. Start MySQL Server.

2\. Create the application database:



```sql

CREATE DATABASE employee\_management;

```



3\. Create the application database user.

4\. Grant the required permissions.

5\. For a fresh installation, execute:



```text

database/schema.sql

```



\### Database Migration History



For existing installations, execute only migrations that have not already been applied.



| Version | Migration |

|---|---|

| v1.4.0 | V1.4.0\_\_create\_departments\_and\_link\_employees.sql |

| v1.5.0 | V1.5.0\_\_add\_employee\_exit\_details.sql |

| v1.6.0 | databaseV1.6.0\_\_add\_user\_authentication.sql |

| v1.7.0 | V1.7.0\_\_add\_forced\_password\_change.sql |



\*\*Important:\*\*

\- Apply migrations sequentially when upgrading an older database.

\- Do not execute `schema.sql` against an existing production database.

\- Back up the database before applying migrations.

\- Verify that each migration has been applied successfully.

\- Hibernate schema management uses `ddl-auto=validate`.



\## Backend Setup



Open PowerShell:



```powershell

Set-Location "employee-backend"

```



Configure the database password:



```powershell

$env:DB\_PASSWORD = Read-Host "Enter your MySQL password"

```



Configure a secure JWT secret:



```powershell

$env:JWT\_SECRET = Read-Host "Enter your JWT secret"

```



Start the backend:



```powershell

mvn spring-boot:run

```



Backend URL:



```text

http://localhost:8080

```



Run backend tests:



```powershell

mvn clean test

```



Build and verify:



```powershell

mvn clean verify

```



\## Frontend Setup



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



\## REST API



Base URL:



```text

http://localhost:8080/api

```



\### Authentication APIs



| Method | Endpoint | Description |

|---|---|---|

| POST | `/auth/login` | Authenticate user |

| PUT | `/auth/change-password` | Change current password |



\### Employee APIs



| Method | Endpoint | Description |

|---|---|---|

| GET | `/employees` | Get employees |

| GET | `/employees/{id}` | Get employee by ID |

| GET | `/employees/department/{departmentId}` | Get employees by department |

| POST | `/employees` | Create employee |

| PUT | `/employees/{id}` | Update employee |

| DELETE | `/employees/{id}` | Delete employee |



\### Department APIs



| Method | Endpoint | Description |

|---|---|---|

| GET | `/departments` | Get all departments |

| GET | `/departments/{id}` | Get department by ID |

| POST | `/departments` | Create department |

| PUT | `/departments/{id}` | Update department |

| DELETE | `/departments/{id}` | Delete department |



\### User Management APIs



| Method | Endpoint | Description |

|---|---|---|

| GET | `/users` | Get user accounts |

| POST | `/users` | Create a user account |

| PUT | `/users/{id}/password` | Reset user password |

| PATCH | `/users/{id}/status` | Activate or deactivate an account |



User Management APIs require ADMIN authorization.



\## Application Routes



| Route | Description |

|---|---|

| `/login` | User login |

| `/change-password` | Mandatory password change |

| `/` | Management overview |

| `/employees` | Employee Management Dashboard |

| `/employees/directory` | Employee Directory |

| `/employees/new` | Add Employee |

| `/employees/:id` | Employee Details |

| `/employees/:id/edit` | Edit Employee |

| `/departments` | Department Management |

| `/departments/:id/employees` | Department Employees |

| `/user-management` | User Account Management |



Routes are protected according to authentication and authorization requirements.



\## Configuration



Database and security configuration are managed through environment variables.



| Variable | Description |

|---|---|

| `DB\_URL` | MySQL connection URL |

| `DB\_PASSWORD` | MySQL application user password |

| `JWT\_SECRET` | Secret used to sign JWT tokens |

| `JWT\_EXPIRATION\_MS` | JWT expiration duration |

| Admin bootstrap variables | Optional initial administrator configuration, if enabled |



Default database URL:



```text

jdbc:mysql://localhost:3306/employee\_management

```



Never commit database passwords, JWT secrets, administrator credentials, or environment-specific secrets to GitHub.



\## Testing and Validation



The release validation process includes:



\### Backend

\- Maven clean test.

\- User account creation validation.

\- Duplicate username and email validation.

\- Password hashing validation.

\- Password reset validation.

\- Forced password change validation.

\- Account activation and deactivation validation.

\- Role-based authorization validation.

\- Authentication restrictions for inactive and terminated employees.

\- Login rate-limiting validation.



\### Frontend

\- Angular production build.

\- Login validation.

\- Invalid login error handling.

\- User Management screen validation.

\- User creation and password reset workflows.

\- Role-based navigation and route access.

\- Mandatory password change workflow.



\### End-to-End

\- Verify login and logout.

\- Verify ADMIN, HR, and EMPLOYEE access restrictions.

\- Verify user creation and password reset.

\- Verify account activation and deactivation.

\- Verify inactive and terminated employee login restrictions.

\- Verify frontend-to-backend API integration.



\## Version History



| Version | Features |

|---|---|

| v1.0.0 | Employee creation and basic management |

| v1.1.0 | Employee details and validation |

| v1.2.0 | Employee update, deletion, and dashboard |

| v1.3.0 | Employee directory, search, filtering, and pagination |

| v1.4.0 | Department management and employee-department relationship |

| v1.5.0 | Employee lifecycle management |

| v1.6.0 | Authentication and role-based access control |

| v1.7.0 | User Account Management, password reset, forced password change, and account status management |



\## Development Roadmap



Planned improvements:



\- Attendance Management.

\- Leave Management.

\- Payroll Management.

\- Reports and Analytics.

\- Docker-based application deployment.

\- Jenkins CI/CD pipeline.

\- GitHub Actions CI workflows.

\- GitHub Container Registry integration.

\- AWS infrastructure using Terraform.

\- Application monitoring and centralized logging.

\- Database backup and recovery automation.

\- Deployment documentation for Windows and Linux environments.



\## Important Notes



\- Hibernate schema management is configured with `ddl-auto=validate`.

\- Database structure changes must be handled through explicit SQL migrations.

\- Passwords are stored using BCrypt hashing.

\- JWT authentication is stateless.

\- Backend authorization must be enforced independently of frontend route restrictions.

\- Inactive user accounts cannot authenticate.

\- Employees with inactive or terminated employment status cannot authenticate.

\- Back up the database before applying migrations.

\- Keep database backups outside the Git repository.

\- Never commit secrets or credentials.

\- Validate backend APIs, frontend builds, and end-to-end workflows before creating a release.

\- Create version tags only after successful release validation.
