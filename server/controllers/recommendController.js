const db = require('../utils/db').pool

function getUnique(array, key) {
    if (typeof key !== "function") {
        const property = key;
        key = function (item) {
            return item[property];
        };
    }
    return Array.from(
        array
            .reduce(function (map, item) {
                const k = key(item);
                if (!map.has(k)) map.set(k, item);
                return map;
            }, new Map())
            .values()
    );
}

const recommendBooks = async (req, res) => {
    const id = req.query.id;

    // Fetch recommendations from the external service
    const response = await fetch(`http://localhost:8000/recommend/book?book_id=${id}&limit=5`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    // Get the recommended book IDs from the response
    const recommendedData = await response.json();
    const recommendedIds = recommendedData.map(rec => parseInt(rec));  // Assuming the IDs are in the `id` field

    console.log("Recommended Book IDs:", recommendedIds);

    // Construct the SQL query to fetch only the recommended books
    const q = `SELECT b.name as bname, b.cover as coverimg, l.name as lname, b.id as bid, l.id as lid, * FROM books b JOIN bookLevel bl ON b.id=bl.book_id JOIN levels l ON l.id=bl.level_id WHERE b.id = ANY($1);`
    
    // Execute the query using the list of recommended IDs
    db.query(q, [recommendedIds], (err, data) => {
        if (err) {
            return res.json(err);
        }

        // Get the unique books and return the result
        const books = data.rows;
        let resVal = getUnique(books, 'bid').slice(0);
        // sort the books by the order of the recommended IDs
        resVal.sort((a, b) => recommendedIds.indexOf(a.bid) - recommendedIds.indexOf(b.bid));
        return res.status(200).json(resVal);
    });
};


module.exports = {
    recommendBooks
}