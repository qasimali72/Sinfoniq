# Sinfoniq - E-Commerce Store

A modern e-commerce platform built with Next.js, featuring product management, shopping cart, and payment integration.

## Features

✅ **Product Catalog** - Browse and search products
✅ **Shopping Cart** - Add/remove items from cart
✅ **Admin Panel** - Add new products easily
✅ **Payment Integration** - Stripe & COD support
✅ **Responsive Design** - Mobile-friendly
✅ **Fast & Scalable** - Built on Next.js

## Tech Stack

- **Frontend:** Next.js, React
- **Styling:** CSS
- **Payment:** Stripe API
- **Hosting:** Vercel
- **Database:** Vercel Postgres (optional)

## Setup & Installation

### Prerequisites
- Node.js 16+ installed
- Git installed
- GitHub account
- Vercel account (free)

### Local Setup

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/sinfoniq.git
cd sinfoniq
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env.local file:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. **Run development server:**
```bash
npm run dev
```

5. **Open in browser:**
```
http://localhost:3000
```

## File Structure

```
sinfoniq/
├── pages/
│   ├── index.js              (Homepage)
│   ├── store.js              (Product listing)
│   ├── cart.js               (Shopping cart)
│   ├── checkout.js           (Payment page)
│   ├── admin/
│   │   └── add-product.js    (Add products)
│   └── api/
│       ├── products.js       (Get products)
│       └── checkout.js       (Process payment)
├── public/
│   └── images/               (Product images)
├── styles/
│   └── globals.css           (Global styles)
├── package.json
├── next.config.js
├── .gitignore
└── README.md
```

## Usage

### Add Products

1. Go to: `http://localhost:3000/admin/add-product`
2. Fill in product details
3. Submit form
4. Product appears in store

### Browse Store

1. Go to: `http://localhost:3000/store`
2. See all products
3. Click "Add to Cart"
4. Checkout when ready

### Deploy to Vercel

1. Push code to GitHub
2. Go to vercel.com
3. Import GitHub repository
4. Click "Deploy"
5. Your site is LIVE! 🚀

## Environment Variables

Create `.env.local` file:

```
NEXT_PUBLIC_API_URL=your_api_url
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_DATABASE_URL=your_database_url
```

## API Routes

- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `POST /api/checkout` - Process payment

## Styling

Global CSS is in `styles/globals.css`. Customize colors, fonts, and layout there.

## Payment Methods

- **Stripe** - Credit/Debit card payments
- **COD** - Cash on Delivery
- **JazzCash** - (Optional, requires setup)

## Troubleshooting

### Port already in use
```bash
npm run dev -- -p 3001
```

### Clear cache
```bash
rm -rf .next
npm run dev
```

### Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Create a branch: `git checkout -b feature/your-feature`
2. Make changes
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

## License

MIT License - feel free to use this project

## Support

For issues or questions, open an issue on GitHub or contact support.

---

**Created:** 2026
**Status:** Active Development
**Version:** 1.0.0
