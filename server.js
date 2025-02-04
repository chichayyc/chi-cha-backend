// server.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for React Native app
app.use(cors());

// Endpoint to fetch events
app.get('/api/events', async (req, res) => {
  try {
    // Fetch the HTML content of the Chi-Cha Lounge events page
    const { data } = await axios.get('https://chichalounge.ca/event-location/chi-cha-lounge/');

    // Load the HTML into Cheerio
    const $ = cheerio.load(data);

    // Array to store scraped events
    const events = [];

    // Scrape the "Upcoming Events" section
    $('.eventon_list_event').each((index, element) => {
      const title = $(element).find('.evcal_event_title').text().trim(); // Extract event title
      const date = $(element).find('.evo_date').text().trim(); // Extract event date
      const location = $(element).find('.evo_location').text().trim(); // Extract event location
      events.push({ title, date, location });
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
  console.log(`Server running on http://localhost:${PORT}`);
});