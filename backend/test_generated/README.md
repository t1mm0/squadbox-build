# Test E-Commerce Project

A modern e-commerce platform built with Next.js, Prisma, and Stripe.

## Features

- Responsive design for all devices
- Product catalog with categories and filters
- User accounts and authentication
- Shopping cart with persistent storage
- Secure checkout with Stripe
- Order history and tracking
- Admin dashboard for product and order management
- SEO optimized

## Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database with initial data
npm run seed

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file with the following:

```
DATABASE_URL="postgresql://user:password@localhost:5432/ecommercedb"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Deployment

This application can be deployed to Vercel or any platform supporting Next.js, Node.js and PostgreSQL.
