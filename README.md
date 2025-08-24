# ShoppingWeb

**Full-Stack Web Application Project**

A comprehensive e-commerce platform **Glasy** demonstrating modern web development practices and secure authentication implementation.

![Glasy](https://github.com/user-attachments/assets/60510ab9-1795-46c0-9046-ccce3e622434)

## Completed Features

 **User Authentication System**
- User Registration & Login
- Email Verification
- JWT with HTTP-Only Cookies
- Custom Security Filter Chain
- React useContext for State Management
**Pages**
- Profile Page

**Coming Soon**
 - Product pages
 - Shopping Cart
 - Payment
 - Admin management page(Role)

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
