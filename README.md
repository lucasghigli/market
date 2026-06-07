# FreshMart Supermarket

A fully functional React.js supermarket e-commerce website with shopping cart, user authentication, order management, and an admin panel.

## Features

- **Product Catalog** — Browse, search, filter, and sort products by category
- **Shopping Cart** — Add/remove items, adjust quantities, persistent cart (localStorage)
- **Checkout** — Simulated payment processing with order creation
- **Authentication** — Login, register, protected routes
- **User Dashboard** — View order history and order details
- **Admin Panel** — Manage products, orders, categories, and users
- **Responsive Design** — Modern UI that works on desktop and mobile

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd supermarket-app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Demo Accounts

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@freshmart.com    | admin123  |
| User  | john@example.com       | user123   |

## Project Structure

```
supermarket-app/
├── public/images/          # Static images
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Public and user-facing pages
│   ├── admin/              # Admin panel pages
│   ├── context/            # React context (Auth, Cart)
│   ├── data/               # Seed data for products & categories
│   ├── services/           # Business logic (localStorage-backed)
│   └── styles/             # Global CSS
├── package.json
└── README.md
```

## Tech Stack

- React 18
- React Router v6
- Vite
- CSS (no external UI framework)
- localStorage for data persistence

## Routes

| Path                  | Access    | Description          |
|-----------------------|-----------|----------------------|
| `/`                   | Public    | Home page            |
| `/products`           | Public    | Product listing      |
| `/products/:id`       | Public    | Product details      |
| `/cart`               | Public    | Shopping cart        |
| `/checkout`           | Auth      | Checkout & payment   |
| `/login`              | Public    | Login                |
| `/register`           | Public    | Register             |
| `/dashboard`          | Auth      | User dashboard       |
| `/orders/:id`         | Auth      | Order details        |
| `/contact`            | Public    | Contact form         |
| `/admin`              | Admin     | Admin dashboard      |
| `/admin/products`     | Admin     | Manage products      |
| `/admin/orders`       | Admin     | Manage orders        |
| `/admin/categories`   | Admin     | Manage categories    |
| `/admin/users`        | Admin     | Manage users         |

## License

MIT
