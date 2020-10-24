var express = require('express');
var router = express.Router();
const stripe = require('stripe')('sk_test_51HWYoNDvsNvNskCcLPsV3eVg3MqT0aBjzgmgZZBf84Li6MMagfJUMFkoux5GqdWEhENJJzkazi8YmGIYF3H6cTEp00nEKYcK9C');
const twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Route for one click payment. This payment method uses the default
 * card the user set during registration with Stripe Set up Intent API.
 */
router.post('/quickpay', async function(req, res, next) {
    const stripeId = req.user.stripeId;
    let totalPrice = req.body.totalPrice;

    totalPrice *= 100;

    // Charge the customer the specified amount with the default card created by
    // the set up intent api when the user registered.
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalPrice,
        currency: 'usd',
        payment_method_types: ['card'],
        customer: stripeId,
        confirm: true
    });

    req.session.paymentIntentId = paymentIntent.id;

    res.redirect('/confirmation');
});

/**
 * Processes payment for when user specifies a new card during checkout.
 */
router.post('/payment', async function(req, res, next){
    const stripeId = req.user.stripeId;
    const stripeToken = req.body.stripeToken;
    let totalPrice = req.body.totalPrice;
    const makeDefault = req.body.checked;
    let cardIdToUse = null;

    // Reformat price into a the chargeable amount that the Stripe API expects
    totalPrice *= 100;

    /**
     * It is important to note that currently in the Stripe API there is no
     * dedupe occuring for cards that have the same fingerprints. This means that
     * multiple cards with the same fingerprints can be attached to the customer when
     * createSource is called multiple times with the same card. In the below we 
     * try our best to mitigate this by doing:
     * 
     * 1. Retrieve the fingerprint of the card entered at checkout from the Stripe Token.
     * 2. Retrieve all cards associated with the customer.
     * 3. Use the Array filter function to to compare the submitted card and against all customer cards
     * 4. If a card was returned by the filter we know that this card already exists and we retrieve the id
     *    to be used in the payment process.
     * 5. If no card was returned by the filter we know that this card is a brand new card and we create a
     *    new card to attach to the customer, the next time this card is entered again it should be
     *    caught by the filter and we will no longer create duplicates for this card.
     * 6. The end result is a card id returned to be used to process payment in the subsequent steps.
     * 
     *    More context can be found here: https://github.com/stripe/stripe-payments-demo/issues/45
     */
    const token = await stripe.tokens.retrieve(stripeToken);
    const cards = await stripe.customers.listSources(
        stripeId,
        {object: 'card'}
    );

    const cardToUse = cards.data.filter(card => card.fingerprint == token.card.fingerprint && 
                                                card.exp_month == token.card.exp_month &&
                                                card.exp_year == token.card.exp_year);
    if (cardToUse.length > 0 ) {
        cardIdToUse = cardToUse[0].id;
    } else {
        const createdCard = await stripe.customers.createSource(
            stripeId,
            {source: token.id}
        );
        cardIdToUse = createdCard.id;
    }

    // Retrieve customer information so we can comapre the default card with the current card used for the charge.
    const customer = await stripe.customers.retrieve(
        stripeId
    );
    /**
     * If user checks the make default box at checkout, we will then update the customer information
     * to make the card entered the default card. However, in order to save on API calls, we only update the
     * card if the user's default card is differnt than the card currently be used to process payment.
     */
    if (makeDefault && customer.default_source != cardIdToUse) {
        console.log('inside if');
        const customer = await stripe.customers.update(
            stripeId,
            {default_source: cardIdToUse}
        );
    }

    // Charge the customer the specified amount with the specified card id.
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalPrice,
        currency: 'usd',
        payment_method_types: ['card'],
        customer: stripeId,
        payment_method: cardIdToUse,
        confirm: true
    });

    req.session.paymentIntentId = paymentIntent.id;

    res.redirect('/confirmation');
});

/* GET dashboard page. */
router.get('/', async function(req, res, next) {
    try {
        var productsToDisplay = new Array();

        // Retrieving all products from Stripe API
        var products = await stripe.products.list();

        // Prices and Products are separate resources so for each product we need to make a call to
        // retrieve all prices and filter by product id, then we associate the price retrieved for
        // the product with the product object itself.
        for (let product of products.data) {
            var prices = await stripe.prices.list({
                product: product.id
            });
            product.price = prices.data[0].unit_amount / 100;

            // So as to not interfere with existing products in the user's dashboard we check to see if
            // the product has custom metadata associated with our app. This signifies that this
            // product is one that we created specifically for our app. This ensures sure that there
            // are no different types of products that their behavior would cause the app to
            // be pushed down a flow where we did not account for leading to confusion for the
            // end user or customer.
            if (product.metadata.testProduct == "true") {
                productsToDisplay.push(product);
            } 
        }

        res.render('dashboard', { 
            title: 'Express',
            products: productsToDisplay
        });
    } catch(e) {
        console.log(e, 'Was not able to retrieve information for dashboard');
        res.sendStatus(500);        
    }
});

module.exports = router;