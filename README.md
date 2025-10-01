# Laravel React ERP System

A modern Enterprise Resource Planning (ERP) system built with Laravel 11 backend and React 19 frontend, featuring TypeScript and Tailwind CSS with Laravel Mix for asset compilation.

## 🚀 Features

-   **Laravel 11** - Modern PHP framework with API authentication
-   **React 19** - Latest React with TypeScript support
-   **Tailwind CSS** - Utility-first CSS framework for modern UI
-   **Laravel Mix** - Asset compilation and bundling
-   **User Authentication** - Secure login/logout system
-   **Responsive Design** - Mobile-friendly interface
-   **Type Safety** - Full TypeScript support

## 🛠️ Tech Stack

### Backend

-   Laravel 11
-   PHP 8.2+
-   MySQL/PostgreSQL
-   Laravel Sanctum (API Authentication)
-   Laravel Mix (Asset Compilation)

### Frontend

-   React 19
-   TypeScript
-   Tailwind CSS
-   Axios (HTTP Client)

## 📋 Prerequisites

-   PHP 8.2 or higher
-   Composer
-   Node.js 18+ and npm
-   MySQL/PostgreSQL
-   Git

## 🚀 Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/naid/laravel-react-erp.git
    cd laravel-react-erp
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install Node.js dependencies**

    ```bash
    npm install
    ```

4. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Database setup**

    ```bash
    # Configure your database in .env file
    php artisan migrate
    php artisan db:seed
    ```

6. **Build assets**
    ```bash
    npm run dev
    ```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start Laravel backend**

    ```bash
    php artisan serve
    ```

2. **Build frontend assets** (in a separate terminal)

    ```bash
    npm run dev
    ```

3. **Access the application**
    - Open your browser and go to `http://localhost:8000`

### Development with Auto-rebuild

For development with automatic asset rebuilding, you can use:

```bash
# Watch for changes (may cause infinite loop on some systems)
npm run watch

# Alternative: Manual rebuild after changes
npm run dev
```

### Production Mode

1. **Build production assets**

    ```bash
    npm run production
    ```

2. **Start Laravel server**
    ```bash
    php artisan serve
    ```

## 🔐 Default Credentials

-   **Email:** `admin@erp.com`
-   **Password:** `password`

## 📁 Project Structure

```
laravel-react-erp/
├── app/
│   ├── Http/Controllers/
│   │   ├── AuthController.php
│   │   └── ClientController.php
│   ├── Http/Middleware/
│   │   └── ValidateClientCookies.php
│   ├── Services/
│   │   └── CookieSecurityService.php
│   └── Models/
│       ├── User.php
│       ├── Client.php
│       ├── Role.php
│       └── ...
├── resources/
│   ├── js/
│   │   ├── components/
│   │   │   ├── App.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── modules/
│   │   │   │   ├── ClientManagement.tsx
│   │   │   │   ├── EmployeeManagement.tsx
│   │   │   │   ├── ProjectManagement.tsx
│   │   │   │   ├── TimeTracking.tsx
│   │   │   │   ├── ReportsAnalytics.tsx
│   │   │   │   └── Settings.tsx
│   │   │   └── contexts/
│   │   │       └── AuthContext.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── app.tsx
│   ├── css/
│   │   └── app.css
│   └── views/
│       └── welcome.blade.php
├── routes/
│   ├── api.php
│   └── web.php
├── database/
│   ├── migrations/
│   └── seeders/
├── public/
│   ├── js/
│   └── css/
├── webpack.mix.js
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## 🎨 Frontend Components

### Login Component

-   Email/password authentication
-   Form validation with error handling
-   Responsive design with Tailwind CSS

### Dashboard Component

-   User information display
-   Role management
-   Logout functionality

### AuthContext

-   Global authentication state management
-   Login/logout functions
-   Token management

## 🔧 Development Commands

```bash
# Laravel commands
php artisan serve              # Start development server
php artisan migrate           # Run database migrations
php artisan db:seed           # Seed database
php artisan key:generate      # Generate application key

# Laravel Mix commands
npm run dev                   # Build assets once for development
npm run production           # Build for production
npm run watch                # Watch for changes (may cause infinite loop)
npm run watch-poll           # Watch with polling (more stable)
```

## 🐛 Troubleshooting

### Infinite Loop with `npm run watch`

If you experience infinite loops with the watch command, use manual builds instead:

```bash
npm run dev  # Build once
# Make changes to files
npm run dev  # Build again
```

### Laravel Mix Build Issues

If you encounter build issues with Laravel Mix:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild assets
npm run dev
```

### Chrome Extension Errors

Console errors from Chrome extensions (like password managers) can be safely ignored as they don't affect the application functionality.

## 📝 API Endpoints

### Authentication

-   `POST /api/login` - User authentication
-   `POST /api/logout` - User logout
-   `GET /api/me` - Get current user
-   `POST /api/register` - User registration
-   `GET /api/client-info` - Get client information

### Client Management

-   `GET /api/clients` - Get all clients
-   `POST /api/clients` - Create new client
-   `PUT /api/clients/{id}` - Update client
-   `DELETE /api/clients/{id}` - Delete client

## 🏢 ERP Modules

### Client Management

-   View all clients in a modern table interface
-   Add, edit, and delete clients
-   Search and filter functionality
-   Real-time data from database
-   Responsive design with Tailwind CSS

### Additional Modules (UI Ready)

-   Employee Management
-   Project Management
-   Time Tracking
-   Reports & Analytics
-   Settings & Configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the BSD-3-Clause License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ronald Magcalas**

-   GitHub: [@naid](https://github.com/naid)

## 🙏 Acknowledgments

-   Laravel team for the amazing framework
-   React team for the powerful frontend library
-   Tailwind CSS team for the utility-first CSS framework
-   All contributors and the open-source community
