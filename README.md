<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#stripe-e-commerce-application)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Overview](#overview)

## Stripe E-Commerce Application

![Imgur](https://i.imgur.com/fp8N5t7.png)

The purpose of this application is to showcase the power of the Stripe API as a foundational piece for an e-commerce application. This application allows the user to take a few actions that ultimately results in the completion of a payment process. The user can:

 1. Register as a new customer or login as an existing customer
 2. Select products to add to their shopping cart
 3. Complete a checkout process and purchase products
 4. Receive confirmation of their purchase, the total amount, and the Charge ID

### Built With
The following libaries are integral to this application. It currently uses Express.js as the web framework, Node.js as the JavaScript interpreter, and Passport.js for the heavy lifting with authentication. These libraries provide the scaffolding for this e-commerce application. Where it really shines is the use of the Stripe API to manage products, customers, and payments.

* [Stripe API](https://stripe.com/docs/api)
* [Twilio API](https://www.twilio.com/docs/usage/api)
* [Express.js](https://expressjs.com/)
* [Node.js](https://nodejs.org/en/)
* [Passport.js](http://www.passportjs.org/)

<!-- GETTING STARTED -->
## Getting Started

There are a few steps that are required for set up in order to get this application up and running locally. You may already have most of these installed, if you do please feel free to skip over those sections. If you encounter an issues during the set up process please do not hesitate to reach out!

### Prerequisites

**NPM**

- This project uses npm as the package manager.  If you do not have npm you can install by following this link [here](https://www.npmjs.com/get-npm).

**Node.js**

- We rely on node to run our application as well as our set up script. For information on installation please refer to this link [here](https://nodejs.org/en/download/).

**MongoDB**

- NOTE: The install MongoDB link in the install guide below is not correct, when downloading please refer to this link [here](https://www.mongodb.com/try/download/community). The rest of the guide is really helpful however.

- This application uses MongoDB to store customer information as well as the Stripe Customer ID associated with each customer. Thankfully, it's pretty easy to set up. Please follow the set up steps [here](https://treehouse.github.io/installation-guides/mac/mongo-mac.html). I used the  ``Install and Run MongoDB by Downloading it Manually`` section and found it really helpful.
 
**Stripe API Keys**

- Lastly, please be sure to have both your publishable test key and secret test key on hand!

### Installation

1. Clone the repo
```sh
git clone https://github.com/carycheng/merchant-store.git
```
2. CD into the root directory of the project and install NPM packages
```sh
npm install
```
3.  The following steps are for setting up your .env file

- Rename the `.env.example` file to `.env` and configure your constants
```
STRIPE_SECRET_KEY = 'YOUR_STRIPE_API_SECRET_KEY_TOKEN' (sk_test)
```
```
STRIPE_PUBLISHABLE_KEY = 'YOUR_STRIPE_API_PUBLISHABLE_KEY_TOKEN' (pk_test)
```
```
TWILIO_SID = 'TWILIO_SID' (please use the one included in the note)
```
```
TWILIO_AUTH_TOKEN = 'TWILIO_AUTH_TOKEN' (please use the one included in the note)
```
```
TWILIO_MAIN_NUMBER = 'TWILIO_MAIN_NUMBER' (please use the one included in the note)
```
Please feel free to use the default `MONGOHOST`specified

4. Please navigate to the `setup` directory and run the `setup.js` script with the following command:
`$ node setup.js`
Once that is complete you will notice that in the `Products` section of your Stripe Dashboard you will see new items added with their associated prices. We will be using this in the application to demonstrate a purchasing experience built on top of the Stripe API. I have added metadata tag to these products as well so existing items in your Product dashboard should not show up in the application.
5. **Note: Please do the following in a separate terminal window.**
- We also need to start up our local database in order to store our users created by this application. You should have MongoDB downloaded and set up by this step, if you have not please refer to the `MongoDB` step in the `Prerequisites` section above. You can start MongoDB server by executing the `mongod` file. 
- Depending on where you are keeping your `mongodb` file the path might be different. For example, I keep my `mongodb`file on my desktop so I use the following command to start my MongoDB server: `~/Desktop/mongodb/bin/mongod`
- Alternatively, if you find the `mongodb` folder you downloaded earlier, you can just click into it go to` bin` -> `mongod` and double click on `mongod` and that should start the Mongo Server as well.
6. Thank you for braving that journey! We are all set up, please use the below to kick off the app: `npm start app.js` and in your browser navigate to `http://localhost:3000/`.

If you run into any issues during this set up please do not hesitate to reach out to me. Alternatively, if there are things that can be improved or clarified in the above guide please let me know!

<!-- Overview -->
## Overview
Below is a quick overview of each page and what its purpose

- Registration page allows new user to create new user/Stripe Customer and save default card. Alternatively a user can login here
![Imgur](https://i.imgur.com/TMpiDix.png)

- Dashboard page retrieves products and prices from Stripe and displays them for the user to add to their cart.
![Imgur](https://i.imgur.com/z2HBcyG.png)

- Shopping cart allows the user to purchase the products that they have selected. This sends a request to Stripe to charge either the default card for the customer or a new card. 
![Imgur](https://i.imgur.com/tWimujq.png)

- The payment confirmation page displays the total amount charged and the Charge ID associated with the payment. The icon allows the customer to view their receipt. The user will also receive the receipt in an SMS.
![Imgur](https://i.imgur.com/78WORc5.png)