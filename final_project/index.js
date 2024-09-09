const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", (req, res, next) => {
    // Retrieve the token from the session or headers
    const token = req.session.authorization?.accessToken || req.headers['authorization']?.split(' ')[1];

    // If no token is found, return an unauthorized status
    if (!token) {
        return res.status(403).json({ message: "Unauthorized access. Please log in." });
    }

    // Verify the token
    jwt.verify(token, 'access', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // If token is valid, proceed with the request
        req.user = decoded;
        next();
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
