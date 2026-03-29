const bcrypt = require("bcryptjs");

const plainPassword = "mypassword123"; // Change this

bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (err) {
        console.error("Error hashing password:", err);
    } else {
        console.log("New hashed password:", hash);
    }
});
