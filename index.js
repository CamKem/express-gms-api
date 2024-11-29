// Require dependencies
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// Setup the basic Express app
const app = express()
const port = 3000

/* 
 * MongoDB connection string
 * 
 * Examples:
 * 
 *   - localhost with no authentication
 *     mongodb://{server}:{port}/{default_db}
 * 
 *   - localhost with basic authentication (username + password)
 *     mongodb://{username}:{password}@{server}:{port}/{default_db}?authSource={auth_db}&authMechanism={auth_type}
 */
const dbConnectionString = ``

// Config API to automatically parse incoming JSON requests (put parsed data in req.body)
app.use(express.json())

// Enable CORS + pre-flight requests for ALL routes/endpoints across the app
// https://expressjs.com/en/resources/middleware/cors.html
app.use(cors({
  origin: "*",  // "http://server.com/"
  methods: "GET,HEAD,POST,PUT,PATCH,DELETE",
  optionsSuccessStatus: 200  // 204 is not liked by some legacy browsers (IE11, smart TVs, etc)
}))

// Store Mongoose DB connection to MongoDB database
const dbConnection = mongoose.connection

// OPTIONAL: Code to run if Mongoose connects successfully
// dbConnection.once("connected", () => {
//   console.log("DB connected successfully! 😀")
// })

// Error handler for any Mongoose database errors
dbConnection.on("error", (err) => {
  console.log("DB error: " + err)
})

// Using Mongoose to connect to our MongoDB database
mongoose
  // Try connecting to the database (Navy MongoDB)
  .connect(dbConnectionString)
  // Success - connected to DB 😀
  .then(() => {

    console.log("DB connected successfully! 😀")

    // Routing using controllers (breaking logic into separate files/locations)
    // Everything for /api/v1 is in /controllers/api_v1/...
    app.use('/api/v1/examples', require('./controllers/api_v1/examples'));

  })
  // Error - problem connecting to DB ❌
  .catch((err) => {
    
    // Handle errors for the initial database connection
    console.error("Database connection error: " + err)

    // OPTIONAL: Kill Node server, otherwise it will run using ONLY the default routes below
    // This forcefully exists using error state (1)
    process.exit(1)
  })

// Default routes of app
app.get('/', (req, res) => {
  res.send('This is an API for testing MongoDB connectivity. You should use /api/v1/')
})

// OPTIONAL: Code section that will run only if current file is the entry point.
if (require.main === module) {

  // Start the API listening (waiting for connections)
  app.listen(port, () => {
    console.log(`Testing API listening on port ${port}`)
  })

}