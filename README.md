# ShoppingWeb

**Full-Stack Web Application Project**

A comprehensive e-commerce platform **Glasy** demonstrating modern web development practices and secure authentication implementation.

![Glasy](https://github.com/user-attachments/assets/ac85b900-ec77-485a-8a2a-720c6b83de40)

## Completed Features

 **User Authentication System**
- User Registration & Login
- Email Verification
- JWT with HTTP-Only Cookies
- Custom Security Filter Chain
- React useContext for State Management
- Role Based Authorization (Customer, Admin, SuperAdmin)

**Pages**
- Profile Page
- Product Page
- Admin Upload Page (Product Upload / Edit)

**Coming Soon**
 - Product pages (Completed 70%)
 - Shopping Cart
 - Payment
 - Admin management page(Role)
    - Upload Product (Done)
    - Edit Product (Done)
    - Manage User account
    - Manage Order

## Technology Stack

**Backend:** Spring Boot + MySQL  
**Frontend:** ReactJS  
**Security:** JWT Authentication with HTTP-Only Cookies

## Quick Start

### Prerequisites
- Java 17+
- Node.js & npm
- MySQL Database
- Maven

### I am using
- React 19.1.0
- Springboot 3.5.0
- Maven Compiler 3.11.0
- Node 20.15.1
- MySQL 8.0.43

### Running the Application

**Backend:**
```bash
cd shopping-backend
mvn clean compile
mvn spring-boot:run
```

**Frontend:**
```bash
cd shopping-frontend
npm install
npm start
```

### Database Setup
1. Create MySQL database named `Shopping_Web`
2. Update database credentials in `application.properties`

## Project Architecture

This application demonstrates:
- **Authentication** - JWT tokens with HTTP-only cookies
- **Full-Stack Integration** - React frontend with Spring Boot backend
- **Security Practices** - Custom filter chains and CORS configuration
- **State Management** - React Context API for user authentication state
- **Email Services** - SMTP-based email verification system
