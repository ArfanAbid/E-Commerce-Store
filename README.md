# Redis-Powered E-Commerce Store

This is a fully functional **eCommerce store** built with the **MERN stack** and enhanced with various features for an optimized user experience. The project includes efficient backend management using **Node.js** and **Express**, along with **Redis** for caching, **AI-powered customer support**, dynamic analytics, and secure payment processing.

![alt text](<Screenshot 2024-12-08 115707.png>)
![alt text](<Screenshot 2024-12-08 115857.png>)


## Key Features:
- **Redis**: Efficient caching for refresh tokens and featured products to reduce server load and improve performance.
- **AI-Powered Support**: Real-time customer assistance using AI-based responses for instant support.
- **Chart.js**: Dynamic sales analytics for admins, helping visualize key metrics and track business performance.
- **Stripe Integration**: Secure and seamless payment processing for a smooth checkout experience.
- **Framer Motion**: Smooth, dynamic animations for an engaging and responsive user interface.
- **Admin Dashboard**: A comprehensive dashboard for admins to manage sales, orders, and customer interactions.

## Tech Stack:
- **Frontend**: React, Framer Motion
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Cache**: Redis
- **Payment Gateway**: Stripe
- **Analytics**: Chart.js
- **Customer Support**: AI-powered chatbot


## Installation:

### 1. Clone the repository:
```bash
git clone https://github.com/ArfanAbid/E-Commerce-Store.git
cd ecommerce-store
```

### 2. Install dependencies:
```bash
cd backend
npm install

cd frontend
npm install
```

### 3. Environment Setup:

For Backend or Root:

- PORT=
- CORS_ORIGIN=
- DATABASE_NAME=E-Commerce-Store
- MONGO_URI=
- UPSTASH_REDIS_URL=
- ACCESS_TOKEN_SECRET=
- REFRESH_TOKEN_SECRET=
- CLOUDINARY_NAME=
- CLOUDINARY_API_KEY=
- CLOUDINARY_API_SECRET=
- STRIPE_SECRET_KEY=
- CLIENT_URL=

For Frontend

- VITE_OPENAI_API_KEY=
- VITE_STRIPE_PUBLISH_KEY=

### 4. Run the application:

```bash 
cd backend
npm start

cd frontend
npm start
```

## Contributing

Contributions are welcome! If you have any improvements, suggestions, or bug fixes, feel free to fork the repository and create a pull request.
