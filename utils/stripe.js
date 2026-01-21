require('dotenv').config(); // Load environment variables from .env file
const Stripe = require('stripe');

let stripeInstance;

async function initializeStripe() {
  // Return cached instance if available
  if (stripeInstance) return stripeInstance;

  const stripeSecretKey =  process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    console.error('Stripe secret key not found in shop config or environment variables');
    throw new Error('Stripe secret key is missing');
  }

  // Validate secret key format
  if (!/^sk_(live|test)_/.test(stripeSecretKey)) {
    throw new Error('Invalid Stripe secret key format');
  }

  // Initialize and cache Stripe instance
  stripeInstance = new Stripe(stripeSecretKey);
  return stripeInstance;
}

module.exports = initializeStripe;
