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

function convertCourses(input) {
    return input.map(course => {
        // if the first child of the courseContents' subTopics' orderNo is empty, remove it
        if (course.courseContents[0].subTopics[0].orderNo !== '') {
            return {
                book_id: codeToNumber(course.courseCode).toString(),
                title: course.courseTitle,
                description: course.courseDescription,
                author: course.faculty,
                audience_level: [`B.Sc. CSIT Semester ${course.semester}`],
                topics: course.courseContents.map(content => content.topic),
                subtopics: course.courseContents.flatMap(content => content.subTopics.map(sub => sub.subTopic)),
                subject: course.courseCode.split(/[^a-zA-Z]/)[0],
            };
        }
    });
}

const fs = require('fs');
const path = require('path');

// Define the directory path for data files
const dataDir = path.join(__dirname, 'data');
const filePath = path.join(dataDir, 'bscsit.json');

// Read the input data from the file
const inputCourses = JSON.parse(fs.readFileSync(filePath));

// Convert the courses
const convertedCourses = convertCourses(inputCourses);

// Write the converted courses to a new file
const outputFilePath = path.join(dataDir, 'courses.json');
fs.writeFileSync(outputFilePath, JSON.stringify(convertedCourses, null, 2));

console.log('Courses converted successfully!');