const { youtube } = require("scrape-youtube");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSearchResults = async (req, res) => {
    const searchTerm = req.query.searchTerm;

    try {
        // Check if searchTerm exists in the database (optional caching)
        const cachedResult = await prisma.searchLog.findFirst({
            where: { searchTerm },
        });

        if (cachedResult) {
            console.log('Returning cached results');
            return res.json(cachedResult.results.slice(0, 5));
        }

        // Perform the YouTube search
        const videos = await youtube.search(searchTerm);

        // Save the search term and results in the database
        await prisma.searchLog.create({
            data: {
                searchTerm,
                results: videos.videos.slice(0, 5), // Limit results before saving
            },
        });

        console.log('Fetched and saved new results');
        return res.json(videos.videos.slice(0, 5));
    } catch (error) {
        console.error('Error fetching search results:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getSearchResults,
};



// const db = require('../utils/db').pool
// const { youtube } = require("scrape-youtube")

// const getSearchResults = async (req, res) => {
//     const searchTerm = req.query.searchTerm;
//     try {
//         const videos = await youtube.search(searchTerm);
//         console.log(searchTerm)
//         return res.json(videos.videos.slice(0, 5))
//     } catch (error) {
//         return res.status(500).json(error.message);
//     }

// }

// module.exports = {
//     getSearchResults
// }