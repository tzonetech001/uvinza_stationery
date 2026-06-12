# Uvinza Stationery - Authentication System

This is a full authentication and user management system built with Angular (frontend) and PHP/MySQL (backend).

## Features

- User registration with role selection (Admin, Manager, Staff)
- Secure login with role-based redirection
- Forgot password functionality
- Role-based dashboards
- Secure password hashing with bcrypt
- Session-based authentication
- Input validation and SQL injection prevention

## Prerequisites

- XAMPP (or any PHP/MySQL server)
- Node.js and npm
- Angular CLI

## Setup Instructions

### 1. Database Setup

1. Start XAMPP and ensure MySQL is running
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create a new database named `uvinza_stationery`
4. Run the SQL script from `database_setup.sql` to create the users table


### 2. Backend Setup

The PHP API files are located in the `api/` folder:
- `config.php` - Database configuration
- `register.php` - User registration
- `login.php` - User login
- `forgot_password.php` - Forgot password verification
- `reset_password.php` - Password reset

Ensure your web server (Apache in XAMPP) is running and can serve PHP files.

### 3. Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the Angular development server:
```bash
ng serve
```

3. Open your browser and navigate to `http://localhost:4200/`

## API Endpoints

- `POST /api/register.php` - Register a new user
- `POST /api/login.php` - Login user
- `POST /api/forgot_password.php` - Verify user for password reset
- `POST /api/reset_password.php` - Reset user password

## User Roles and Redirection

- **Admin** → `/admin/dashboard`
- **Manager** → `/manager/dashboard`
- **Staff** → `/staff/dashboard`

## Security Features

- Passwords are hashed using bcrypt
- Prepared statements prevent SQL injection
- Input validation on both client and server
- CORS headers configured
- Session-based authentication

## Development

To generate a new component:
```bash
ng generate component component-name
```

## Build

To build the project for production:
```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
"# uvinza_stationery" 
https://github.com/tzonetech001/uvinza_stationery

