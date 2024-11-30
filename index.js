// Require dependencies
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import imp from "./utils/import.js";
import dynamicRouter from "./middleware/dynamicRouter.js";

// Load env vars and setup defaults for app
dotenv.config()
const app = express();
const port = process.env.APP_PORT;
const host = process.env.APP_HOST;

// MongoDB connection string
const dbConnectionString = process.env.DB_CONNECTION_STRING;

// Config API to automatically parse incoming JSON requests (put parsed data in req.body)
app.use(express.json())

// Enable CORS + pre-flight requests for ALL routes/endpoints across the app
// https://expressjs.com/en/resources/middleware/cors.html
app.use(cors({
  origin: "*",  // "http://server.com/"
  methods: "GET,HEAD,POST,PUT,PATCH,DELETE",
  optionsSuccessStatus: 200  // 204 is not liked by some legacy browsers (IE11, smart TVs, etc)
}))

// Error handler for any Mongoose database errors
mongoose.connection.on("error", (err) => {
  console.log("DB error: " + err)
})

// Using Mongoose to connect to our MongoDB database
mongoose.connect(dbConnectionString)
  .then(() => {
      console.log("DB connected successfully! 😀")

      // Home route
      app.get('/', (req, res) => {
          res.send('This is an API for testing MongoDB connectivity. You should use /api/v1/')
      })

      // Documentation route
      app.get('/docs', (req, res) => {
            res.send('This is the documentation for the API')
      });

      // catch all routes that are not '/api' or '/' (home) and return the 404 respoense
      app.use(async (req, res) => {
          // if the path is /api then run the dynamic router
            if (req.url.startsWith('/api')) {
                console.log('running dynamic router', req.url);
                return await dynamicRouter(req, res);
            }

          if (!req.url.startsWith('/api') || req.url !== '/') {
              const invalidRouteResponse = {
                  'message': 'Invalid link, please check the API docs.',
                  'documentation': 'http://localhost:3000/api/v1/'
              }
              res.status(404).send(invalidRouteResponse)
          }
      })


      const currentFile = decodeURIComponent(import.meta.url);
      const comparisonFile = `file://${decodeURIComponent(process.argv[1])}`;
      // OPTIONAL: Code section that will run only if the current file is the entry point.
      // CJS: if (require.main === module) {
      if (currentFile === comparisonFile) {
          app.listen(port, () => {
              console.log(`API listening on ${host}:${port}`)
          })
      }

  })
  .catch((err) => {
    console.error("Database connection error: " + err)
    process.exit(1)
});