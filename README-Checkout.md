## Lula Checkout Set up
These are the steps needed to complete to make sure the checkout and post order features are working.
Reach out to the Lula Checkout Team if you run into any issues during this set up.

### API Keys
Make sure you have these API keys in your environment files

.env file for the backend (lula-ecommerce-store)
```
DEVELOPER_ID=63913338-3fb2-4d83-8bd8-e20ef3ec7079
KEY_ID=c29a1883-5eef-42d9-978b-08726facf51b
SIGNING_SECRET=HIR6p2CxAhASfXRXsZDR7CmikoJUYgUbvOUwDZwAy1Q

UBER_CLIENT_ID=GVNnsyBJyAJAGruW3OmBx16OL-y_w5DS
UBER_CLIENT_SECRET=TX0neGBmx3am-v4QLqOd4WEOzWK9A6T5oPq_3Lzz
UBER_CUSTOMER_ID=c692e9ee-d841-55aa-acd4-4a9b8e919e12

PAYPAL_SANDBOX=true
PAYPAL_CLIENT_ID=AY0mmhpDnx1I3eTzi0C4vJph0zT53pFkiLped5qUAmR_DG0kAXWvyLaeFA1BUz20xX7oc3Rrirx9eAa6
PAYPAL_CLIENT_SECRET=EAF1KGisSewFUdxqvpXyBWyzlfE3ksJIlc8H1458hG6oCBugzhqS9p4wt6MSo52HZzudytHJ2PCTrTe0
PAYPAL_AUTH_WEBHOOK_ID=<WEBHOOK_ID>

STRIPE_API_KEY=sk_test_51OctK9ASao5Y3eBc1VD41kVuOdV2ufWorwBctbLB4iUax5ZATzMAPID4Mwim8lP386lPRKvtuOXf8ikJQGdzZYIU00n8QxDjhQ

TWILIO_SMS_ACCOUNT_SID=ACbf7d21155e596540a389212bacd45559
TWILIO_SMS_AUTH_TOKEN=124cfe6bb455dbbc209447164bbb2907
TWILIO_SMS_FROM_NUMBER=+18667957084

SENDGRID_API_KEY=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
SENDGRID_FROM=ada77@drexel.edu
SENDGRID_ORDER_PLACED_ID=d-b6731d7f45624a139c9d427d67ee2256
```

.env.local file for the frontend (lula-ecommerce-store-storefront)
```
NEXT_PUBLIC_STRIPE_KEY=pk_test_51OctK9ASao5Y3eBch28GouzAioFxpCGY2XOkp4xqxq8yn15BdvUOffK798hcue3wagnK1dczfdV4SM3XprCdY8M8004FaU7hRE
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AY0mmhpDnx1I3eTzi0C4vJph0zT53pFkiLped5qUAmR_DG0kAXWvyLaeFA1BUz20xX7oc3Rrirx9eAa6
```

### Installing npm package dependencies
In your terminal cd in both project lula-ecommerce-store and lula-ecommerce-store-storefront and run the command:
```
npm install
```
If you run into an npm error for a twilio package in the lula-ecommerce-store project then just force the install,
this is because the twilio package for medusa has yet to update. Waiting for medusa to fix this.
```
npm install --force
```

### Run migration
We created a migration in the backend to create a new model which is basically a new table in Postgres.
1. In your terminal cd in the backend folder (lula-ecommerce-store)
2. Run this command to run the migrations
```
npx medusa migrations run
```
3. Once the migrations are finished running now build your medusa backend by using this command
```
npm run build
```
4. Now check to see if the new table is in the medusa database, the table should be named dspDelivery with the columns
- id
- deliveryQuoteId
- dspOption
- deliveryId
- createdAt
- updatedAt

### Starting medusa backend + admin
Now you should be able to run the medusa backend + admin now
```
npm run dev
```
### Updating Payment and Fulfillment Providers
1. Sign into the medusa admin
2. Go to the Settings
3. Go to Regions
4. Select the 'EU' region
5. Click the 3 dots to edit the region details
6. Make sure in the Payment Providers dropdown that only 'Manual' is selected
7. In Fulfillment Providers dropdown select 'dsp-fulfillment', this should be the only one selected
8. Save and close
9. Now delete all the Shipping and Return Shipping Options for the EU region.
10. Select the 'NA' region
11. Click the 3 dots to edit the region details
12. In the Payment Providers dropdown select the options 'Manual', 'Stripe', 'paypal'
13. In Fulfillment Providers dropdown select 'dsp-fulfillment', this should be the only one selected
14. Save and close
15. Now delete all the Shipping and Return Shipping Options for the NA region.
16. Click the 'Add Option' for Shipping Options
17. In title type in 'DSP'
18. For price type select 'Calculated'
19. For shipping profile select 'Default Shipping Profile'
20. For fulfillment method select 'dsp-fulfillment via dsp-fulfillment'
21. Save and close

### Updating Taxes
1. Go back to Settings
2. Select Taxes
3. Select 'NA'
4. Click 'New Tax Rate'
5. In Name type 'Philadelphia Tax Rate'
6. In tax rate input '8%''
7. In tax code input '1000'
8. Now click 'Add Overrides'
9. Select all products then click add
10. Finally click Create

### Final Steps
1. Stop the medusa backend + admin in the terminal that is currently running it.
2. Build the medusa backend + admin again
```
npm run build
```
3. Now start the medusa backend + admin again
```
npm run dev
```
4. Open a new terminal and cd to the frontend (lula-ecommerce-store-storefront)
5. Start the medusa storefront
```
npm run dev
```
6. Open the storefront and try to checkout
7. Verify that when delivery is chosen and the delivery info is entered and the continue to payment button is clicked that a delivery fee is displayed in the order summary section. Also that there is an option to pay with paypal and credit card. The test card number is 42 repeating and the cvc code can be anything and just need a valid date that hasnt passed.
