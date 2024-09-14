import 'dotenv/config'; // Use dynamic import for dotenv
import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import { URL } from 'url';
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const urlDatabase = {};

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;


  // Validate URL format
  try {
    new URL(originalUrl); // Throws an error if invalid

    const urlObject = new URL(originalUrl);

    // Check if the URL has a valid protocol
    if (!['http:', 'https:'].includes(urlObject.protocol)) {
      res.json({ error: 'invalid url' })
    }

  } catch (e) {
    return res.json({ error: 'invalid url' });
  }
  

  // Generate a unique short URL ID
  const shortUrlId = nanoid(6); // Generates a 6-character ID

  // Store the URL mapping
  urlDatabase[shortUrlId] = originalUrl;

  // Send the response
  res.json({
    original_url: originalUrl,
    short_url: shortUrlId
  });
});

// Endpoint to resolve short URLs
app.get('/api/shorturl/:id', (req, res) => {
  const shortUrlId = req.params.id;
  const originalUrl = urlDatabase[shortUrlId];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

