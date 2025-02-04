// server.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Use dynamic port for Render

// Enable CORS for React Native app
app.use(cors());

// Default route for root path
app.get('/', (req, res) => {
  res.send('Welcome to the Chi-Cha Lounge Events API. Use /api/events to fetch events.');
});

// Endpoint to fetch events
app.get('/api/events', async (req, res) => {
  try {
    // Fetch the HTML content of the Chi-Cha Lounge events page
    const { data } = await axios.get('https://chichalounge.ca/events');

    // Load the HTML into Cheerio
    const $ = cheerio.load(data);

    // Array to store scraped events
    const events = [];

    // Scrape the "Upcoming Events" section
    $('.eventon_list_event').each((index, element) => {
      const image = $(element).find('.event_image').attr('src'); // Extract event image URL
      const title = $(element).find('.evcal_event_title').text().trim(); // Extract event title
      const dateTime = $(element).find('.evo_date').text().trim(); // Extract event date and time
      const location = $(element).find('.evo_location').text().trim(); // Extract event location
      events.push({ image, title, dateTime, location });
    });

    // Send the scraped events as JSON
    res.json(events);
  } catch (error) {
    console.error('Error scraping events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});