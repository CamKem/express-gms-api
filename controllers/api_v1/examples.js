import express from 'express';
// Create Router to handle this specific route (/api/v1/examples)
const examples = express.Router();

const dig = '\\(\\d\\+\\)';

/* Define the routes/endpoints */

// Get all examples
// GET /api/v1/examples
examples.get('/', async (req, res) => {
  // TESTING: placeholder response text
  res.send('GET all examples.');
});

// Get an example
// GET /api/v1/examples/:id  ("id" must be digits)
examples.get(
    `/:id${dig}`,
    async (req, res) => {
  // TESTING: placeholder response text
  res.send('GET a single example, ID: ' + req.params["id"]);
});

// Add an example
// POST /api/v1/examples
examples.post(
    '',
    async (req, res) => {
  // TESTING: placeholder response text
  res.send('POST an example');
});

// Update an example (entire example object)
// PUT /api/v1/examples/:id
examples.put(
    `/:id${dig}`,
    async (req, res) => {
  // TESTING: placeholder response text
  res.send('PUT an example, ID: ' + req.params["id"]);
});

// Update an example (partial update)
// PATCH /api/v1/examples/:id
examples.patch(
    `/:id${dig}`,
    async (req, res) => {
  // TESTING: placeholder response text
  res.send('PATCH an example, ID: ' + req.params["id"]);
});

// Delete an example
// DELETE /api/v1/examples/:id
examples.delete(`/:id${dig}`,
    async (req, res) => {
  // TESTING: placeholder response text
  res.send('DELETE an example, ID: ' + req.params["id"]);
});

// Export/return the Router to the calling code
// module.exports = examples;
// to export default in ES6, you can do it like this:
export default examples;