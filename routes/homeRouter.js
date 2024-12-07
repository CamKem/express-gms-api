import express from "express";
import HtmlResponse from "../utils/responses/htmlResponse.js";

const homeRouter = express.Router();

homeRouter.get('/', (req, res, next) => {
    return new HtmlResponse(req)
        // TODO: write a landing page for accessing the API, send html for rendering
        .send('This is the landing page for the GMS API, please visit /api-docs for API documentation')
});

export default homeRouter;