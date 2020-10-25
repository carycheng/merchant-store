const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const products = [
    {
        name: "Home Office Ergonomic Desk Chair",
        description: "Be good to yourself, ergonomic design to help with those long days",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQPfBQ-1jCPEhEVUafdpeT1yuQ6gXovgs52PA&usqp=CAU",
        price: 4000,
        testProduct: true
    },
    {
        name: "Slim Low Profile 24 In. Monitor",
        description: "This low profile monitor will surely help you reclaim your desk space",
        imageUrl: "https://static.dezeen.com/uploads/2019/04/samsung-space-monitor-promotions_dezeen_2364_hero_9-852x511.jpg",
        price: 15000,
        testProduct: true
    },
    {
        name: "Set of 20 Soft Bound Notebooks",
        description: "Notebooks to help keep your ideas safe",
        imageUrl: "https://i.pinimg.com/originals/fd/5b/b5/fd5bb5120414b6cb89a84bb9c4249a35.jpg",
        price: 1800,
        testProduct: true
    },
    {
        name: "Personal Coaching with Dynamic Draymond",
        description: "Get your weekly pump up with Draymond Green",
        imageUrl: "https://cdn.trendhunterstatic.com/thumbs/metal-ballpoint-pen.jpeg",
        price: 2300,
        testProduct: true
    },
    {
        name: "Meditating with Klay Thompson",
        description: "Finding your inner peace with zen master Klay and his dog Rocco",
        imageUrl: "https://mspoweruser.com/wp-content/uploads/2020/05/Surface-Mobile-Mouse.jpg",
        price: 1100,
        testProduct: true
    },
    {
        name: "Noise Canceling Headphones",
        description: "Block out the distraction and increase your focus. Soft cushioning provides comfort for hours",
        imageUrl: "https://www.idgcdn.com.au/dimg/700x700/dimg/screenshot_2019-12-09_meet_the_new_surface_headphones__the_smarter_way_to_listen__microsoft_surface1.png",
        price: 8000,
        testProduct: true
    }
]

/**
 * Set up function that creates products and prices from the above configuration.
 * If there are custom items you would like to insert please adjust the above products
 * array accordingly. This function makes two calls:
 * 1. Create product with associated metadata
 * 2. Create prices for product and attach to product
 * 
 * Note: Stripe attaches boolean value as String when inserting as a metadata value.
 */
async function setup() {
    for (const product of products) {
        const createdProduct = await stripe.products.create({
            name: product.name,
            description: product.description,
            images: [product.imageUrl],
            metadata: {
                testProduct: product.testProduct
            }
        });

        const price = await stripe.prices.create({
            unit_amount: product.price,
            currency: 'usd',
            product: createdProduct.id,
        });
    }

    console.log('Successfully added all products to Stripe console');
}

setup()