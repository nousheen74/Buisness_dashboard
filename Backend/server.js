const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

// Sample SEO headlines for regeneration
const seoHeadlines = [
    "Why {business} is {location}'s Top Choice in 2025",
    "Discover {location}'s Best {business} - Expert Guide 2025",
    "{business}: {location}'s Premier Destination This Year",
    "The Ultimate {business} Experience in {location} - 2025",
    "{location}'s Hidden Gem: {business} Revealed",
    "Why Locals Choose {business} in {location}",
    "{business} - {location}'s Most Trusted Name",
    "Experience Excellence at {business} in {location}",
    "{location}'s #1 {business} - What Makes It Special",
    "Your Complete Guide to {business} in {location}"
];

// Helper function to generate random rating and reviews
function generateBusinessData() {
    const rating = (Math.random() * 2 + 3).toFixed(1); // Rating between 3.0 and 5.0
    const reviews = Math.floor(Math.random() * 500) + 50; // Reviews between 50 and 550
    return { rating, reviews };
}

// Helper function to get random headline
function getRandomHeadline(businessName, location) {
    const randomHeadline = seoHeadlines[Math.floor(Math.random() * seoHeadlines.length)];
    return randomHeadline.replace('{business}', businessName).replace('{location}', location);
}

// POST /business-data endpoint
app.post('/business-data', (req, res) => {
    try {
        const { name, location } = req.body;
        if (!name || !location) {
            return res.status(400).json({ 
                error: 'Business name and location are required' 
            });
        }
        const { rating, reviews } = generateBusinessData();
        const headline = getRandomHeadline(name, location);

        res.json({
            rating: parseFloat(rating),
            reviews: reviews,
            headline: headline  
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/regenerate-headline', (req, res) => {
    try {
        const { name, location } = req.query;
        if (!name || !location) {
            return res.status(400).json({ 
                error: 'Business name and location are required' 
            });
        }
        const newHeadline = getRandomHeadline(name, location);
        res.json({ headline: newHeadline });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'Business Dashboard Backend is running!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 