import express from "express";
import {Response} from "../utils/responses.js";

const homeRouter = express.Router();

homeRouter.get('/', (req, res, next) => {
    return new Response(req)
        .asType('text/html')
        // TODO: write a landing page for accessing the API, send html for rendering
        .send('This is an API for testing MongoDB connectivity. You should use /api/v1/')
});

export default homeRouter;