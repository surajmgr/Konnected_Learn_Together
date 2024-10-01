// import fetch from 'node-fetch';

async function getImage(courseTitle) {
    const apiKey = '15808819-aca31ac6c91f49a6563d397d1'; // Your Pixabay API key
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${courseTitle.replace(/ /g, '+')}&image_type=photo`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Define expected aspect ratio (width / height) for a book cover
        const expectedAspectRatio = 2 / 3;
        let closestImage = null;
        let closestRatioDifference = Infinity;

        // Iterate over the images returned by Pixabay
        for (const hit of data.hits) {
            const aspectRatio = hit.imageWidth / hit.imageHeight;

            // Calculate the absolute difference from the expected aspect ratio
            const ratioDifference = Math.abs(aspectRatio - expectedAspectRatio);

            // Update closest image if this one is closer
            if (ratioDifference < closestRatioDifference) {
                closestRatioDifference = ratioDifference;
                closestImage = hit.webformatURL; // URL of the image
            }
        }

        // Return the URL of the closest image found
        return closestImage;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null; // Return null if there's an error
    }
}

const fs = require('fs');
const path = require('path');

// Define the directory path for data files
const dataDir = path.join(__dirname, 'data');
const filePath = path.join(dataDir, 'bscsit.json');

// Read the input data from the file
const inputCourses = JSON.parse(fs.readFileSync(filePath));

const changeImages = async (inputCourses) => {
    for (const course of inputCourses) {
        const imageUrl = await getImage(course.courseTitle);
        course.image = imageUrl;
        console.log(`Image for ${course.courseTitle}: ${imageUrl}`);
    }
}

(async () => {
    await changeImages(inputCourses);
    fs.writeFileSync(filePath, JSON.stringify(inputCourses, null, 2));
    console.log('Images fetched and updated successfully!');
})();