const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// Load proverbs from JSON file
let proverbs = require('./proverbs.json');

// Get all proverbs (with optional category filter)
app.get('/proverbs', (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = proverbs.filter(p => p.category.toLowerCase() === category.toLowerCase());
    return res.json(filtered);
  }
  res.json(proverbs);
});

// Get a single proverb by ID
app.get('/proverbs/:id', (req, res) => {
  const proverb = proverbs.find(p => p.id === parseInt(req.params.id));
  if (!proverb) return res.status(404).json({ error: 'Proverb not found' });
  res.json(proverb);
});

// Add a new proverb
app.post('/proverbs', (req, res) => {
  const newProverb = {
    id: Date.now(),
    ...req.body
  };
  proverbs.push(newProverb);
  fs.writeFileSync('./proverbs.json', JSON.stringify(proverbs, null, 2));
  res.status(201).json(newProverb);
});

// Update a proverb
app.put('/proverbs/:id', (req, res) => {
  const index = proverbs.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Proverb not found' });

  proverbs[index] = { ...proverbs[index], ...req.body };
  fs.writeFileSync('./proverbs.json', JSON.stringify(proverbs, null, 2));
  res.json(proverbs[index]);
});

// Delete a proverb
app.delete('/proverbs/:id', (req, res) => {
  proverbs = proverbs.filter(p => p.id !== parseInt(req.params.id));
  fs.writeFileSync('./proverbs.json', JSON.stringify(proverbs, null, 2));
  res.json({ message: 'Proverb deleted' });
});

// Get a random proverb
app.get('/proverbs/random', (req, res) => {
  const random = proverbs[Math.floor(Math.random() * proverbs.length)];
  res.json(random);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});