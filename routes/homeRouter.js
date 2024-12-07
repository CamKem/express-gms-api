import express from "express";
import HtmlResponse from "../utils/responses/htmlResponse.js";

const homeRouter = express.Router();

homeRouter.get('/', (req, res, next) => {
    return new HtmlResponse(req)
        // TODO: write a landing page for accessing the API, send html for rendering
        .send('This is an API for testing MongoDB connectivity. You should use /api/v1/')
});

export default homeRouter;