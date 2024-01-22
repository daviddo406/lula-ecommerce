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

### Database Set-up (REQUIRED)
Login as postgres user:
```
#windows
psql -U postgres

#mac
psql postgres
```

Create a database as postgres user, named medusa-nuSM:
```
create database "medusa-nuSM";
```

Run this cmd to copy database schema:
```
psql -U postgres -W -d medusa-nuSM -f medusa-copy.sql
```

***IF POSTGRES WAS SET UP WITH A PASSWORD, YOU MUST FOLLOW THESE STEPS***
Go to lula-ecommerce-store/.env

Looking at the database url, we need to add your password.
This is what it should look like now:
```
DATABASE_URL=postgres://postgres@localhost/medusa-nuSM
```

add your PASSWORD as:
```
DATABASE_URL=postgres://postgres:PASSWORD@localhost/medusa-nuSM
```

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

