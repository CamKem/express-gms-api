import express from "express";
const rootRouter = express.Router();

rootRouter.use((req, res, next) => {
    // Default route
    if (req.url === '/') {
        res.success('Homepage for the GMS API');
    }

    // Documentation route
    if (req.url === '/docs') {
        res.success('Documentation for the GMS API');
    }

    return next();
});

export default rootRouter;