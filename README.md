# Himal Wear Nepal — React clothing store + eSewa demo

A ready-to-run demo clothing storefront for Nepal.

## Features
- Responsive storefront
- Product details + size selection
- Persistent shopping cart
- NPR prices
- Nepal delivery address form
- Cash on Delivery
- eSewa ePay v2 UAT/demo checkout
- Server-generated HMAC-SHA256 signature
- Success response signature validation
- Server-side eSewa transaction status check

## Run it
1. Install Node.js 18+.
2. Open this folder in VS Code.
3. Copy `.env.example` to `.env`.
4. Run:
   npm install
   npm run dev
5. Open http://localhost:5173

Both Vite and the Express API run from the same command.

## eSewa test
Select eSewa at checkout. The app POSTs to the eSewa UAT form.

Current eSewa developer documentation lists test credentials. Check the official test-credentials page before testing because credentials can change.

Important: This project keeps the eSewa secret on the server. Do NOT move it into React/Vite or expose it using a VITE_ environment variable.

## Before production
This is a demo, not a production commerce backend. Before accepting real orders:
- Replace in-memory/demo order handling with a database.
- Store an order server-side before redirecting to eSewa.
- Bind transaction UUID, amount and customer/order ID in the database.
- Make payment verification idempotent.
- Add authentication/admin controls.
- Add inventory/stock validation.
- Add rate limiting, validation, logging, HTTPS and security headers.
- Obtain live merchant credentials from eSewa.
- Change the eSewa form/status URLs to the live endpoints from official docs.
- Never commit a live secret key.
- Replace remote demo images with your own licensed product photography.

## eSewa integration notes
The payment request signs:
`total_amount,transaction_uuid,product_code`

The server verifies the signed success payload and then calls eSewa's transaction status endpoint. A browser redirect by itself is never treated as proof of payment.
