# 🎟️ Ticket Bari

A modern online ticket booking platform where users can browse, search, and book tickets for buses, trains, flights, and launches. Vendors can manage their own tickets, while admins control the entire platform through a dedicated dashboard.

## 🌐 Live Website

https://a-fff.vercel.app

## 🚀 Features

### 🔐 Authentication & Authorization

* JWT Authentication
* Secure Login & Registration
* Role-Based Access Control (User, Vendor, Admin)
* Protected Routes

### 👤 User Features

* Browse Available Tickets
* Search Tickets by Route
* View Ticket Details
* Book Tickets Online
* Stripe Payment Integration
* View Booking History
* Manage Personal Profile

### 🏢 Vendor Features

* Vendor Dashboard
* Add New Tickets
* Update Ticket Information
* Delete Tickets
* Manage Own Listings
* View Ticket Statistics

### 🛠️ Admin Features

* Manage All Users
* Manage All Vendors
* Approve or Control Vendor Activities
* Monitor Platform Statistics
* Manage Tickets Across the Platform

### 💳 Payment System

* Stripe Payment Gateway
* Secure Online Transactions
* Booking Confirmation After Successful Payment

### 📊 Dashboard

* User Dashboard
* Vendor Dashboard
* Admin Dashboard
* Dynamic Statistics & Management Panels

## 🧰 Technologies Used

### Frontend

* Next.js
* React
* Tailwind CSS
* HeroUI
* Axios
* TanStack Query

### Backend

* Node.js
* Express.js
* MongoDB
* JWT
* Cookie Parser

### Payment

* Stripe

### Deployment

* Vercel (Frontend)
* Vercel/Node Server (Backend)

## 📦 NPM Packages

```bash
@heroui/react
@stripe/react-stripe-js
@stripe/stripe-js
@tanstack/react-query
axios
react-hook-form
sweetalert2
jsonwebtoken
cookie-parser
cors
dotenv
mongodb
stripe
```

## 🔑 Environment Variables

### Frontend

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Backend

```env
PORT=
DB_USER=
DB_PASS=
JWT_SECRET=
STRIPE_SECRET_KEY=
CLIENT_URL=
```

## 📂 Project Structure

```bash
src/
├── app/
├── components/
├── hooks/
├── providers/
├── services/
├── utils/
└── layouts/
```

## 🎯 Main Functionalities

* User Registration & Login
* Role-Based Authorization
* Ticket Management
* Ticket Booking
* Secure Payments
* Dashboard Management
* Vendor Management
* Admin Controls
* Responsive Design

## 👨‍💻 Developer

Developed by Easin

## 📜 License

This project is created for educational and portfolio purposes.
