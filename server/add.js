const Pool = require('pg').Pool;
require('dotenv').config()
const fs = require('fs');

// Create a pool instance with environment variables
const pool = new Pool({
  user: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  database: 'konnected_new'
});

// Function to fetch the required data
async function getBooksData() {
  const client = await pool.connect();
  try {
    const query = `
        SELECT 
            b.id AS book_id,
            b.name AS title,
            b.description,
            b.author,
            ARRAY_AGG(DISTINCT l.name::VARCHAR) AS audience_level,  -- Cast to VARCHAR
            ARRAY_AGG(DISTINCT t.name::VARCHAR) AS topics,          -- Cast to VARCHAR
            ARRAY_AGG(DISTINCT st.name::VARCHAR) AS subtopics,      -- Cast to VARCHAR
            ARRAY_AGG(DISTINCT 'Information Technology'::VARCHAR) AS subject  -- Cast to VARCHAR
        FROM books b
        LEFT JOIN booklevel bl ON b.id = bl.book_id
        LEFT JOIN levels l ON bl.level_id = l.id
        LEFT JOIN topicbook tb ON b.id = tb.book_id
        LEFT JOIN topics t ON tb.topic_id = t.id
        LEFT JOIN subtopics st ON t.id = st.topic
        GROUP BY b.id
    `;

    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    client.release();
  }
}

function replaceNullsWithEmptyArray(data) {
    return data.map(book => {
      // Replace null values in array fields with [""] if they are null
      return {
        ...book,
        audience_level: book.audience_level[0] || [""],
        topics: book.topics[0] || [""],
        subtopics: book.subtopics[0] || [""],
        subject: book.subject[0] || [""]
      };
    });
  }
  
  // Function to write the data to a JSON file
  async function writeDataToFile() {
    const booksData = await getBooksData();
    
    // Replace null values with empty arrays where necessary
    const updatedData = replaceNullsWithEmptyArray(booksData);
    
    const jsonData = JSON.stringify(updatedData, null, 2); // Pretty print with 2 spaces
    
    // Write the JSON data to a file
    fs.writeFile('books_data.json', jsonData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file', err);
      } else {
        console.log('JSON file has been saved.');
      }
    });
  }

// Call the function to fetch data and write to file
writeDataToFile();
