import express from "express";
const rootRouter = express.Router();
import {Response} from "../utils/responses.js";

rootRouter.get('/', (req, res, next) => {
    res.type('text/html');
    new Response(req)
        // TODO: write a landing page for accessing the API
        //  and send a html file to be rendered here
        .send('This is an API for testing MongoDB connectivity. You should use /api/v1/')
});

rootRouter.get('/docs', (req, res, next) => {
    new Response(req)
        // TODO: actually write the documentation
        //  and send a html file to be rendered here
        .send('This is the documentation for the API');
});

export default rootRouter;