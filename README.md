# 🎟️ Event Management System

A full-stack **Event Management Web Application** built for a campus environment as part of **Winter of Code**.  
The platform allows **organizers** to create and manage events, and **users (students)** to explore, like, and register for events seamlessly.

---

## 🚀 Live Demo
> [Under Progress](https://event-management-28c1b.web.app)

---

## 🧠 Project Overview

This project is designed to solve common campus event management challenges by providing:

- Centralized event listings
- Role-based access (Organizer / User)
- Ticket tier selection
- Interest (like) system
- Secure registration flow
- Scalable Firestore data modeling

The system is built using **modern React patterns** and **Firestore best practices** without requiring any paid cloud storage.

---

## 🛠️ Tech Stack

### Frontend
- **React.js**
- **JavaScript (ES6+)**
- **Tailwind CSS**
- **React Router DOM**

### Backend / Database
- **Firebase Authentication**
- **Cloud Firestore**
- **Firestore Transactions**

---

## ✨ Features

### 👤 Authentication & Roles
- Firebase Authentication
- Role-based users:
  - `user` → can explore & register for events
  - `organizer` → can create & manage events
- Protected routes & conditional UI rendering

---

### 🧑‍💼 Organizer Features
- Create events with:
  - Title, description, category
  - Date & duration
  - Location with Google Maps link
  - Multiple ticket tiers
- Edit events (including ticket tiers)
- View registration count per event

---

### 🎓 User Features
- Browse upcoming events
- View detailed event pages
- Like / Unlike events (interest system)
- Select ticket tier
- Register for events
- Duplicate registration prevention

---

### ❤️ Interest (Like) System
- Toggle-based like/unlike button
- Prevents duplicate likes
- Uses Firestore atomic array operations
- Displays most popular events by interest count

---

### 🎫 Event Registration System
- Ticket tier selection
- Firestore subcollection for registrations
- Prevents duplicate registrations
- Atomic `registeredCount` update using transactions

---

## 🗂️ Firestore Data Model

### 📄 `users` Collection
```js
users
 └── userId
      ├── name
      ├── email
      ├── role        // "user" | "organizer"
      ├── createdAt


events
 └── eventId
      ├── title
      ├── description
      ├── category
      ├── date
      ├── duration
      ├── location
      ├── pricingTiers
      ├── imageBase64
      ├── organizerId
      ├── likedBy
      ├── registeredCount
      ├── createdAt


events/{eventId}/registrations/{userId}
 ├── userId
 ├── selectedTier
 ├── registeredAt


# Clone the repository
git clone https://github.com/your-username/event-management.git

# Navigate to project directory
cd event-management-system

# Install dependencies
npm install

# Start development server
npm start
