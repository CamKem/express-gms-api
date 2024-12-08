import express from "express";
import HtmlResponse from "../utils/responses/htmlResponse.js";

const homeRouter = express.Router();

homeRouter.get('/', (req, res, next) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="description" content="Grocery Management System API">
            <meta name="author" content="Cameron Kemshal-Bell">
            <meta name="keywords" content="Grocery, Management, System, API">
            <link rel="icon" href="/favicon.ico" type="image/x-icon">
            <meta property="og:image" content="/gms-og.png">
            <meta property="og:title" content="Grocery Management System API">
            <meta property="og:description" content="Grocery Management System API">
            <meta property="og:url" content="https://gms.iterated.tech">
            <meta property="og:type" content="website">
            <meta property="og:site_name" content="Grocery Management System API">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:site" content="Grocery Management System API">
            <meta name="twitter:creator" content="@CamKem">
            <meta name="twitter:title" content="Grocery Management System API">
            <title>Grocery Management System API</title>
            <style>
                :root {
                    --primary: #007bff;
                    --secondary: #004bab;
                }
                body {
                    font-family: 'Roboto', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    color: #333;
                }
                header {
                    background-color: var(--secondary);
                    color: white;
                    padding: 20px 0;
                    text-align: center;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                main {
                    margin: 40px auto;
                    max-width: 800px;
                    padding: 20px;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    vertical-align: center;
                }
                footer {
                    margin-top: 40px;
                    text-align: center;
                    color: #777;
                    padding: 20px 0;
                    background-color: #f4f4f4;
                    border-top: 1px solid #ddd;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                ul li {
                    /* this should have a textured background image, and a border radius */
                    background-image: linear-gradient(45deg, var(--primary), var(--secondary));
                    /*background: #007bff;*/
                    color: white;
                    margin: 5px 0;
                    padding: 10px;
                    border-radius: 4px;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
                }
                ul li:hover {
                    background: #0056b3;
                }
                ul li a {
                    color: white;
                    text-decoration: none;
                    width: 100%;
                }
                p {
                    display: inline-flex;
                    flex-direction: row;
                    width: 100%;
                    align-items: center;
                }
                a {
                    color: #007bff;
                    text-decoration: none;
                    /* make the stuff inside the a tag vertically aligned with the text */
                    display: inline-flex;
                    align-items: center;
                    margin-left: 10px;
                }
                a:hover {
                    text-decoration: underline;
                }
                ul li a:hover .image {
                    background: white;
                }
                .image {
                    padding: 5px;
                    margin-right: 10px;
                    border-radius: 3px;
                    background: rgba(255, 255, 255, 0.8);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);                    
                }
                footer p {
                  justify-content: center;
                  width: 100%;
                }
                .white {
                    color: white;
                }
            </style>
        </head>
        <body>
            <header>
            <div style="display: flex; justify-content: center;">
                <img src="/cabbage.svg" alt="Grocery Management System Logo" style="height: 40px; margin: 0 10px;">
                <img src="/carrot.svg" alt="Grocery Management System Logo" style="height: 40px; margin: 0 10px;">
                <img src="/tomato.svg" alt="Grocery Management System Logo" style="height: 40px; margin: 0 10px;">
            </div>
            <h1>Grocery Management System API</h1>
            </header>
            <main>
                <p>Welcome to the Grocery Management System API!</p>
                <p>To view the swagger API documentation, please visit<a href="/api-docs">/api-docs</a></p>
                <p>
                This API is a RESTful service that allows you to manage grocery products, orders, carts, employees, and customers.
                This project is built with the following technologies:
                </p>
                <ul>
                    <li>
                        <a href="https://nodejs.org/">
                            <img src="node.svg" alt="Node.js Logo" style="height: 40px" class="image"><span class="white">Node.js</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://expressjs.com/">
                            <img src="/express.svg" alt="Express.js Logo" style="height: 40px" class="image"><span class="white">Express.js</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.mongodb.com/">
                            <img src="/mongo.svg" alt="MongoDB Logo" style="height: 40px" class="image"><span class="white">MongoDB</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://mongoosejs.com/">
                            <img src="/mongoose.png" alt="Mongoose Logo" style="height: 40px" class="image"><span class="white">Mongoose</span>
                        </a>
                    <li>
                        <a href="https://swagger.io/">
                            <img src="/swagger.svg" alt="Swagger Logo" style="height: 40px" class="image"><span class="white">Swagger UI</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://openapis.org/">
                            <img src="/openapi.svg" alt="OpenAPI Logo" style="height: 40px" class="image"><span class="white">OpenAPI Specification</span>
                        </a>
                    </li>
                </ul>
                <p>Build for scalability utilizing features such as:</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
                    <ul>
                        <li>Middleware</li>
                        <li>Rate Limiting</li>
                        <li>Logging</li>
                        <li>Global Error Handling</li>
                        <li>API Documentation</li>
                        <li>Environment Variables</li>
                        <li>Data Modeling</li>
                    </ul>
                    <ul>
                        <li>Authentication</li>
                        <li>Authorization</li>
                        <li>Structred Responses</li>
                        <li>Validation</li>
                        <li>Role-Based Access Control</li>
                        <li>Testing</li>
                        <li>And more...</li>
                    </ul>
                    <p>View the project on:<a href="https://github.com/CamKem/express-gms-api" class="shadow"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" style="height: 40px;"> GitHub</a>.</p>
                </div>
            </main>           
            <footer>
                <p>&copy; ${new Date().getFullYear()}Grocery Management System</p>
            </footer>
        </body>
        </html>`;
    return new HtmlResponse(req)
        .send(htmlContent);
});

export default homeRouter;