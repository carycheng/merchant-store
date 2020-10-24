var express = require('express');
var router = express.Router();
require("dotenv").config();

// Set up connection to the Stripe API through the SDK
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);

// Set up mongoose connection and reference to User Model
const mongoose = require('mongoose');
const User = require('../models/User');
const passport = require('passport');

// Create connection to local db called merchant-app
mongoose.connect('mongodb://localhost/merchant-app', () => {
  console.log('Connection to MongoDB succeeded');
});

/*
 * Uses passport local strategy to look for a user with the
 * email provided in db. If user email exist, then compare the
 * password provided with the password stored in the db.
*/
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
});

/* 
 * Checks to see if user currently exists in the db.
 * If not, creates a new Stripe Customer to associated with
 * new user object and inserts into database.
*/
router.post('/register', async(req, res) => {

    var email = req.body.email;
    var password = req.body.password;
    var telNumber = req.body.telephone;
    var stripeToken = req.body.stripeToken;
    console.log('Stripe Token: ' + req.body.stripeToken);
 
    // First we check the db to see if a user with the same email already exists. If user already exists
    // prompt new user to sign in instead. Else, user does not exist and we can insert new user.
    const user = await User.findOne({ email: email });
    if (user) {
        console.log('User already exists, please have user sign in instead')
        res.redirect('/');
    }

    // Creating a new Stripe Customer with email and telephone number
    const newStripeCustomer = await stripe.customers.create({email: email, phone: telNumber});

    // Create new card to attach to customer.
    const card = await stripe.customers.createSource(
        newStripeCustomer.id,
        {source: stripeToken}
    );

    // Set up the intent for customer to pay at a later time in order to support one click checkout.
    // const setupIntent = await stripe.setupIntents.create({
    //     customer: newStripeCustomer.id,
    //     payment_method: card.id,
    //     payment_method_types: ['card']
    // });

    // Creating new user object to insert into db. Please see User model for full describe of schema
    const newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.stripeId = newStripeCustomer.id;
    newUser.phoneNumber = telNumber

    // Save user to db then send request to authenticate through passport.
    newUser.save().then(userSaved => {
        passport.authenticate('local') (req, res, function() {
            res.redirect('/dashboard');
        });
    }).catch(err => {
        res.send('User was not saved due to error: ' + err);
    });
});

module.exports = router;