# Sinfoniq Setup & Deployment Guide

## Table of Contents
1. [Local Development](#local-development)
2. [GitHub Upload](#github-upload)
3. [Vercel Deployment](#vercel-deployment)
4. [Adding Products](#adding-products)
5. [Payment Integration](#payment-integration)
6. [Troubleshooting](#troubleshooting)

---

## Local Development

### Prerequisites
- Node.js 16+ (download from nodejs.org)
- Git installed
- VS Code or any code editor

### Step 1: Install Node.js

**Windows/Mac/Linux:**
1. Go to https://nodejs.org
2. Download LTS version
3. Run installer → Click Next → Install
4. Verify installation:
```bash
node --version
npm --version
```

### Step 2: Download Project Files

**Option A: Already have the files**
```bash
cd /path/to/sinfoniq
```

**Option B: Create new from scratch**
```bash
# Create folder
mkdir sinfoniq
cd sinfoniq
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs all packages from package.json (Next.js, React, etc.)

### Step 4: Run Development Server

```bash
npm run dev
```

You'll see:
```
> next dev

ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 5: Open in Browser

Go to: `http://localhost:3000`

You should see the Sinfoniq homepage! ✅

### Step 6: Test the Store

1. Click "Shop Now" → See all products
2. Click "Add to Cart" → Product added
3. Click "View Cart" → Shopping cart
4. Click "Proceed to Checkout" → Fill form → Place Order
5. Go to `/admin/add-product` → Add new product

---

## GitHub Upload

### Step 1: Create GitHub Account

1. Go to: https://github.com
2. Click "Sign up"
3. Enter email, password
4. Verify email

### Step 2: Create Repository

1. Login to GitHub
2. Click "+" (top right)
3. Click "New repository"
4. Fill in:
   ```
   Repository name: sinfoniq
   Description: My e-commerce store
   Visibility: Public
   ```
5. **DON'T** check "Initialize with README"
6. Click "Create repository"

**Copy your repo URL:** `https://github.com/YOUR_USERNAME/sinfoniq.git`

### Step 3: Setup Git Locally

**In your sinfoniq folder:**

```bash
# Initialize git
git init

# Configure git (do once)
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Sinfoniq e-commerce store"

# Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/sinfoniq.git

# Rename branch
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 4: Verify on GitHub

Go to: `https://github.com/YOUR_USERNAME/sinfoniq`

You should see all your files there! ✅

---

## Vercel Deployment

### Step 1: Create Vercel Account

1. Go to: https://vercel.com
2. Click "Sign up"
3. Click "Continue with GitHub"
4. Authorize Vercel

### Step 2: Import Project

1. Click "New Project"
2. Click "Import Git Repository"
3. Search for "sinfoniq"
4. Click to select it
5. Click "Import"

### Step 3: Configure Project

Keep all defaults, just click "Deploy"

### Step 4: Wait for Deployment

You'll see status: "Building..." → "Ready"

**Your site is LIVE at:** `https://sinfoniq.vercel.app`

### Step 5: Custom Domain (Optional)

1. Go to Vercel Dashboard
2. Click your project
3. Go to "Settings" → "Domains"
4. Add your custom domain (if you have one)

---

## Adding Products

### Method 1: Using Admin Panel (Recommended)

1. Go to: `http://localhost:3000/admin/add-product` (local)
   OR `https://sinfoniq.vercel.app/admin/add-product` (live)

2. Fill in product details:
   - Product Name: "Shirt"
   - Price: 500
   - Description: "Cotton shirt"
   - Image URL: `https://via.placeholder.com/300x300?text=Shirt`
   - Stock: 100
   - Category: Clothing

3. Click "Add Product"

4. See product in store immediately! ✅

### Method 2: Using API (Advanced)

```bash
# Test with curl
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jeans",
    "price": 800,
    "image": "https://via.placeholder.com/300x300?text=Jeans",
    "stock": 50,
    "description": "Blue jeans"
  }'
```

### Image URL Options

**Free Image Hosting:**

1. **Placeholder (No signup needed):**
   ```
   https://via.placeholder.com/300x300?text=ProductName
   ```

2. **Cloudinary (Free tier):**
   - Go to: https://cloudinary.com
   - Sign up (free)
   - Upload image
   - Copy image URL
   - Use in product form

3. **GitHub:**
   - Push image to GitHub repo
   - Right-click → Copy raw link
   - Use in product form

---

## Payment Integration

### For Cash on Delivery (COD)

Already working! No setup needed.

### For Credit Card (Stripe)

1. **Create Stripe Account:**
   - Go to: https://stripe.com
   - Sign up
   - Get API keys from Dashboard

2. **Add to .env.local:**
   ```
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

3. **For TCS Shipping:**
   - Get TCS credentials
   - Add to .env.local
   - Update `/pages/api/checkout.js` with TCS API call

---

## Updating Code & Auto-Deploy

### Every time you make changes:

```bash
# Make code changes locally
# Then:

git add .
git commit -m "Description of changes"
git push
```

**Vercel automatically deploys!** (60 seconds to live)

No need to manually deploy. Just push to GitHub. ✅

---

## Folder Structure Explained

```
sinfoniq/
├── pages/                  # All pages & API routes
│   ├── index.js           # Homepage /
│   ├── store.js           # Store /store
│   ├── cart.js            # Cart /cart
│   ├── checkout.js        # Checkout /checkout
│   ├── admin/
│   │   └── add-product.js # Add product /admin/add-product
│   ├── api/               # API routes
│   │   ├── products.js    # /api/products
│   │   └── checkout.js    # /api/checkout
│   ├── _app.js            # App wrapper (navigation)
│   └── _document.js       # HTML wrapper
├── styles/
│   └── globals.css        # All styling
├── public/
│   └── images/            # Store images (optional)
├── package.json           # Dependencies
├── next.config.js         # Next.js config
├── .gitignore            # Files to ignore in Git
├── .env.example          # Environment variables template
├── .env.local            # Your actual env variables (DO NOT commit)
├── README.md             # Project info
└── SETUP.md              # This file
```

---

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint

# Push to GitHub
git push

# Check git status
git status

# View commit history
git log

# Undo last commit
git reset --soft HEAD~1
```

---

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

### Delete node_modules and reinstall

```bash
rm -rf node_modules package-lock.json
npm install
```

### Vercel shows blank page

- Check logs: `vercel logs --follow`
- Make sure next.config.js is correct
- Rebuild: Go to Vercel → Redeploy

### Images not loading

- Check image URL is correct
- Try: `https://via.placeholder.com/300x300?text=Test`
- Use HTTPS (not HTTP)

### Cart not working

- Make sure localStorage is enabled
- Check browser console for errors
- Try incognito mode

### Products not showing

- Check `/api/products` endpoint
- Try adding product via admin panel
- Check browser console for errors

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Add your first 10 products
3. ✅ Test full checkout flow
4. ✅ Share with friends: `https://sinfoniq.vercel.app`
5. ✅ Buy custom domain (~₨600/year)
6. ✅ Setup Stripe payments (optional)
7. ✅ Setup TCS integration (optional)
8. ✅ Add email notifications (optional)

---

## Support

**Having issues?**

1. Check console: F12 → Console tab
2. Check Vercel logs
3. Read error messages carefully
4. Try clearing cache
5. Restart development server

---

**Happy selling!** 🚀

Questions? Email: support@sinfoniq.com
