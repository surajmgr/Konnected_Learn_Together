const db = require('../utils/db').pool
const { youtube } = require("scrape-youtube")

const getSearchResults = async (req, res) => {
    const searchTerm = req.query.searchTerm;
    try {
        const videos = await youtube.search(searchTerm);
        console.log(searchTerm)
        return res.json(videos.videos.slice(0, 5))
    } catch (error) {
        return res.status(500).json(error.message);
    }

}

module.exports = {
    getSearchResults
}