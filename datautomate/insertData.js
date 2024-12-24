const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Create a pool of connections to the PostgreSQL database
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'konnected_new',
    password: '',
    port: 5432,
});

// Define the directory path for data files
const dataDir = path.join(__dirname, 'data');
const filePath = path.join(dataDir, 'bscsit.json');

// Read the input data from the file
const inputCourses = JSON.parse(fs.readFileSync(filePath));

function codeToNumber(code) {
    let number = 0;
    for (let char of code) {
        // Convert character to ASCII value
        const asciiValue = char.charCodeAt(0);

        // Update the number using a hash-like approach and ensure it's within integer range
        number = (number * 31 + asciiValue) % 2147483647; // Use 31 as a base multiplier
    }
    return number; // Return the final number within integer range
}

// Function to get or create level ID based on course semester
async function getOrCreateLevelId(semester) {
    const levelName = `BSc. CSIT Semester ${semester}`;
    
    // Check if the level exists
    let result = await pool.query(
        'SELECT id FROM levels WHERE name = $1 LIMIT 1',
        [levelName]
    );

    // If the level does not exist, insert a new one
    if (result.rows.length === 0) {
        const insertResult = await pool.query(
            'INSERT INTO levels (name, sl_name) VALUES ($1, $2) RETURNING id',
            [levelName, levelName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()]
        );
        return insertResult.rows[0].id; // Return the new level ID
    }

    // Return the existing level ID
    return result.rows[0].id;
}

// Function to insert courses into the database
async function insertCourses(courses) {
    try {
        await pool.connect();

        // first clear the tables
        // cannot truncate a table referenced in a foreign key constraint
        // so we need to truncate the child tables first
        await pool.query('DELETE FROM subtopics');
        await pool.query('DELETE FROM topicbook');
        await pool.query('DELETE FROM topics');
        await pool.query('DELETE FROM booklevel');
        await pool.query('DELETE FROM books');
        await pool.query('DELETE FROM levels');
        
        for (const course of courses) {
            // if the first child of the courseContents' subTopics' orderNo is empty, remove it
            if (course.courseContents[0].subTopics[0].orderNo === '') {
                return;
            }
            // Get or create the level ID based on the course's semester
            const levelId = await getOrCreateLevelId(course.semester);

            // Insert into books table
            const bookResult = await pool.query(
                `INSERT INTO books (id, name, s_name, description, cover, author, is_verified, upload_date, uid) 
                 VALUES ($1, $2, $3, $4, $5, 'konnected', $6, CURRENT_DATE, NULL) RETURNING id`,
                [
                    codeToNumber(course.courseCode), 
                    course.courseTitle.slice(0, 250), 
                    course.courseTitle.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, '-').toLowerCase().slice(0, 15),
                    course.courseDescription, 
                    course.image, 
                    '1'
                ]
            );
            const bookId = bookResult.rows[0].id;

            for (const content of course.courseContents) {
                // Insert into topics table
                const topicResult = await pool.query(
                    'INSERT INTO topics (name, st_name) VALUES ($1, $2) RETURNING id',
                    [
                        content.topic.slice(0, 250), 
                        content.topic.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, '-').toLowerCase().slice(0, 15)
                    ]
                );
                const topicId = topicResult.rows[0].id;

                for (const sub of content.subTopics) {
                    // Insert into subtopics table
                    let capitalizedSubTopic = sub.subTopic;
                    while (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ' '].includes(capitalizedSubTopic.charAt(0))) {
                        capitalizedSubTopic = capitalizedSubTopic.slice(1);
                    }
                    capitalizedSubTopic = capitalizedSubTopic.charAt(0).toUpperCase() + capitalizedSubTopic.slice(1);
                    
                    await pool.query(
                        'INSERT INTO subtopics (name, sst_name, topic) VALUES ($1, $2, $3)',
                        [
                            capitalizedSubTopic,
                            sub.subTopic.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, '-').toLowerCase().slice(0, 15),
                            topicId
                        ]
                    );
                }
                // Associate the topic with the book
                await pool.query(
                    'INSERT INTO topicbook (book_id, topic_id) VALUES ($1, $2)',
                    [bookId, topicId]
                );
            }

            // Associate the book with the level
            await pool.query(
                'INSERT INTO booklevel (book_id, level_id) VALUES ($1, $2)',
                [bookId, levelId]
            );

            console.log(`Course inserted: ${course.courseTitle}`);
        }
    } catch (err) {
        console.error('Error inserting courses:', err);
    } finally {
        await pool.end();
    }
}

// Call the function to insert courses
insertCourses(inputCourses);
