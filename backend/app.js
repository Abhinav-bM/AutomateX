const express = require('express')
const app = express()
require('dotenv').config();
const PORT = process.env.PORT || 3000


// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Handling


app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})
