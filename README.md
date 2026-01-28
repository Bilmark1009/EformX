# EformX - Modern Form Management System

EformX is a powerful, full-stack form management application that allows users to create dynamic forms, share them with public links, and track responses in real-time. Designed with a focus on modern aesthetics (glassmorphism) and seamless user experience.

## ✨ Key Features

- **Drag-and-Drop Form Builder**: Easily create and arrange form fields.
- **Dynamic Field Types**: Support for text, email, number, textarea, and more.
- **Public Form Links**: Share unique URLs for respondents to fill out forms.
- **Real-time Response Tracking**: View and manage submissions immediately.
- **Authentication System**: Secure login and registration for form creators.
- **Modern UI/UX**: Overhauled design with glassmorphism, smooth animations, and responsive layouts.

## 🛠️ Tech Stack

### Frontend
- **React 18** (with Hooks & Context API)
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling & Design System)
- **dnd-kit** (Drag and Drop functionality)
- **Axios** (API Requests)
- **React Router Dom** (Navigation)

### Backend
- **Laravel 12** (PHP Framework)
- **Sanctum** (API Authentication)
- **PHP 8.2+**

---

## 🚀 Getting Started

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js & npm
- SQLite (or your preferred database)

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. Configure environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Run migrations:
   ```bash
   php artisan migrate
   ```
5. Start the server:
   ```bash
   php artisan serve
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env`:
   Make sure `VITE_API_BASE_URL` points to your backend (default: `http://localhost:8000/api`).
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📱 Project Structure

- **`/frontend`**: The React application, containing the UI components, pages, and context providers.
- **`/backend`**: The Laravel API, managing database logic, authentication, and form data.
- **`/frontend/src/pages`**: Contains the 7 core pages of the app:
  - Dashboard, Form Builder, Login, Register, Public Form, Responses, and Response Viewer.

## 📄 License
MIT License
