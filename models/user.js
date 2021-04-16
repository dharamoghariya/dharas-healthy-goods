const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
    firstName: 
    {
        type: String,
        required: true
    },
    lastName: 
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true
    },
    password:
    {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

//This function is called before a user is saved to the database.
userSchema.pre("save", function(next) {
    var user = this;

    // Generate a unique salt.
    bcrypt.genSalt(10)
    .then((salt) => {

        // Hash the password, using the salt.
        bcrypt.hash(user.password, salt)
        .then((encryptedPwd) => {
            // Password was hashed, update the user password.
            // The new hased password will be saved to the database.
            user.password = encryptedPwd;
            next();
        })
        .catch((err) => {
            console.log(`Error occured when hashing. ${err}`);
         });
    })
    .catch((err) => {
        console.log(`Error occured when salting. ${err}`);
     });

 });

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;