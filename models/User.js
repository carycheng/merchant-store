const mongoose = require('mongoose');
var bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    stripeId: {
        type: String,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: false,
        uniqe: false
    }
});

/*
This is a prehook for prepping & hashing the user password before insertion
into the db. I think it would be best to keep the models class clean, including
only the model definition, but since this is a utility hook tied intimately into a 
User model I think it makes sense to add this here.
*/
UserSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('users', UserSchema);