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
Python 3.11.5

### Database Set-up (REQUIRED)
Login as postgres user:
```
psql -U postgres
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


### Install Meilisearch plugin/instance for Medusa (IF NOT SETUP BEFORE)
In the directory of your Medusa backend, run the following command to install the MeiliSearch plugin:

```
npm install medusa-plugin-meilisearch
```

Then also run this command to install MeiliSearch:

```
curl -L https://install.meilisearch.com | sh
```

Next, launch Meilisearch by running the following command in your terminal where "aSampleMasterKey" is your personal master key:

```
./meilisearch --master-key="aSampleMasterKey"
```

*Your Meilisearch instance is currently running in the terminal, keep it running and do not exit!*


### Configuring Meilisearch in Medusa (IF NOT CONFIGURED ALREADY)
Documentation here: https://docs.medusajs.com/plugins/search/meilisearch

Then, add the following environment variables to your Medusa backend in .env:
```
MEILISEARCH_HOST=<YOUR_MEILISEARCH_HOST>
MEILISEARCH_API_KEY=<YOUR_MASTER_KEY>
```
Where <YOUR_MEILISEARCH_HOST> is http://127.0.0.1:7700 (installed locally), and <YOUR_MASTER_KEY> is "aSampleMasterKey" from the previous step.


Finally, in medusa-config.js add the following item into the plugins array:

```
const plugins = [
  // ...
  {
    resolve: `medusa-plugin-meilisearch`,
    options: {
      // config object passed when creating an instance
      // of the MeiliSearch client
      config: {
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY,
      },
      settings: {
        products: {
          indexSettings: {
            "searchableAttributes": [
              "title",
              "description",
              "variant_sku",
            ],
            "displayedAttributes": [
              "id", 
              "title", 
              "description", 
              "variant_sku", 
              "thumbnail", 
              "handle",
            ],
          },
          primaryKey: "id",
        },
  
      },
    },
  },
```

Next, ensure that the search feature is enabled in store.config.json:

```
{
  "features": {
    "search": true
  }
}
```

Then, add the necessary environment variables in .env.local:

```
NEXT_PUBLIC_SEARCH_ENDPOINT=<YOUR_MEILISEARCH_HOST>
NEXT_PUBLIC_SEARCH_API_KEY=<YOUR_API_KEY>
NEXT_PUBLIC_INDEX_NAME=products
```
Where <YOUR_MEILISEARCH_HOST> is http://127.0.0.1:7700 (installed locally), and <YOUR_API_KEY> is "aSampleMasterKey" from the previous step.

*Meilisearch is now ready to be used when running the backend, make sure you have launched Meilisearch in a terminal window first*




### Importing CSV Product Data Instructions
Make sure Python is installed "Python 3.11.5" at least.

First you need to run the python script that transforms the Lula given CSV into a Medusa import friendly CSV.

Locate transform.py script under /lula-ecommerce directory:
```
cd /lula-ecommerce
```

Run the script with:
```
/usr/bin/python3 transform.py
```

*At this point you will generate a new CSV file called LULA_TO_MEDUSA_IMPORT.csv, this file will be used to import into the Medusa backend database from the admin dashboard*





### Starting Medusa Backend
```
cd lula-ecommerce-store
npm install
npx @medusajs/medusa-cli develop
```

*Will be hosted on localhost:7001/*

**When asked for login credentials for admin dashboard, use distributed credentials provided by Drexel Lula Shopping team.**


### Importing Product Data (IF NOT ALREADY)

After logging in, go to Products on the left hand side, and click on Collections.

Next click on "+ New Collection", and add all of these below where (Water is Title and water is Handle):

Water,
Wine,
Snacks,
Seltzer,
Candy,
Beer,
Alcohol,
Personal Care,
Beverages,
Grocery,
Automotive,
Milk,
Quick Meals,
Bakery,
Others


Next, go to Products, and click on Import Products.

Next select the LULA_TO_MEDUSA_IMPORT.csv file to import.

Wait a few minutes for data to be imported.

After seeing all products appear in the products list, you need to make sure you add them into the Sales Channel to be visible.

Click on a product, then click on the three dots next to the title of the product and select "Edit Sales Channels".

Click on Add Channels, and select the Default Medusa Sales Channel for the Product.


*The product will now be visible/available on the website*

### Set NEXT_PUBLIC_SALES_CHANNEL_POOL Variable in .env.local (Get Publishable Api Key from Admin Dashboard -> Settings -> API Key Management)
```
NEXT_PUBLIC_SALES_CHANNEL_POOL="publishable_api_key_here"
```

### Set MEDUSA_ADMIN_BACKEND_URL in .env (IMPORTANT FOR STORE LOCATION SWITCHING TO WORK)
```
MEDUSA_ADMIN_BACKEND_URL=http://localhost:9000
```

### YOU CAN CREATE A FEW SALES CHANNELS FROM THE MEDUSA ADMIN DASHBOARD

1) From the admin dashboard, go to settings, then Sales Channels. Next, click on the '+' symbol to add a sales channel.

2) Enter the title (Ex: Wawa - 3604 Chestnut St) and Description (Ex: 3604 Chestnut St, Philadelphia, PA 19104).

3) Click on "publish channel".

4) You can then add products to the sales channel on the right hand side.


### Binding a Sales Channel to the Publishable API Key

1) From the admin dashboard, go to settings, then API Key Management.

2) Beside the API Key, there are 3 dots on the rightmost side, click on it and hit "Edit sales channels"

3) You can remove by ticking the box next to the sales channel listed, or add a channel by clicking "Add channels" and selecting one to add.

Note: Currently, it is recommended to only bind one sales channel per api key at a time.



### Starting Next.js Storefront
```
cd lula-ecommerce-store-storefront
npm install
npm run dev
```

*Will be hosted on localhost:8000/*





### IF YOU IMPORTED PRODUCT DATA BEFORE AND NEED TO CLEAR/RESET THE DATABASE 
```
cd lula-ecommerce
chmod +x reset-db.sh
./reset-db.sh
```

*At this point you will be prompted for your postgres Password, enter it a few times when asked to reset the database*



### IF YOU GET MEILISEARCH ERRORS INVOLVING HOSTNAMES FROM IMAGES NOT INCLUDED IN next.config.js

Locate next.config.js under /lula-ecommerce-store-storefront

Add new entry with missing hostname from error code in here:

```
images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
```


### You may need to install react-select package if you receive any errors regarding react-select package missing

Just ctrl+c the frontend and run:

```
cd lula-ecommerce-store-storefront
npm install react-select
npm run dev
```

