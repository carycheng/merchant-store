var express = require('express');
var router = express.Router();
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// GET route for confirmation page handling all purchase confirmation logic
router.get('/', async function(req, res, next) {
    const paymentIntentId = req.session.paymentIntentId;
    const stripeCustomerId = req.user.stripeId;
    const phoneNumber = req.user.phoneNumber;

    // A user should only be allowed to navigate to this page once
    // payment is complete. If not payment has been completed there should be
    // nothing to show so we send back an unauthorized response.
    if (!paymentIntentId) {
        res.sendStatus(401);
    }

    // Given the payment intent id, return the charges associated with it
    const charges = await stripe.charges.list({
        payment_intent: paymentIntentId,
    });

    // Extract the charge from the list of charges associated with the payment intent.
    // For our app we are creating a new payment intent per purchase so in this case
    // we should be expecting a list of one item in the charges associated our created
    // payment intent.
    const chargeObject = charges.data[0];
    const paymentDetails = chargeObject.payment_method_details;

    // Prep extracted objects for rendering and use
    const chargeId = chargeObject.id;
    const chargeAmountToDisplay = chargeObject.amount / 100;
    const cardLastDigits = paymentDetails.card.last4
    const receiptUrl = chargeObject.receipt_url;

    // Twilio Client to send receipt from purchase to the phone number the user specified during registration.
    // Pretty awesome that if no 'from' number is not specified the client handles the error for you so the client
    // does not need to wrap this in a try-catch
    const twilioMessageBody = `Hi there! $${chargeAmountToDisplay} has been charged to your card ending in ${cardLastDigits}. Here is the receipt for your recent purchase: ${receiptUrl}. We hope to see you again soon!`
    twilioClient.messages
        .create({body: twilioMessageBody, from: process.env.TWILIO_MAIN_NUMBER, to: phoneNumber})
        .then(message => console.log(message.sid));

    res.render('confirmation', {
        title: 'Merchant App',
        chargeId: chargeId,
        totalPrice: chargeAmountToDisplay,
        receiptUrl: receiptUrl
    });
});

module.exports = router;