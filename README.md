# lula-ecommerce
Lula codebase for shopping and checkout teams. Based around headless design through Medusa.

Project was setup using this guide: https://docs.medusajs.com/create-medusa-app.
***POSTGRES/DATABASE HAS NOT BEEN SET UP***

## Quick-Start Guide  

### Prerequisites
Node.js v16+
Git
PostgresSql
Next.js

### Starting Medusa Backend
```
cd lula-ecommerce-store
npm install
npx @medusajs/medusa-cli develop
```

*Will be hosted on localhost:7001/*

**When asked for login credentials for admin dashboard, use distributed credentials provided by Drexel Lula Shopping team.**

### Starting Next.js Storefront
```
cd lula-ecommerce-store-storefront
npm install
npm run dev
```

*Will be hosted on localhost:8000/*

