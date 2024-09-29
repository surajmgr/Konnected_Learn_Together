const puppeteer = require('puppeteer');

async function startBrowser() {
    let browser;
    try {
        console.log("Opening the browser......");
        // full viewport for the browser
        browser = await puppeteer.launch({
            headless: false,
            args: ["--disable-setuid-sandbox", "--start-maximized"],
            defaultViewport: null,
            'ignoreHTTPSErrors': true
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

async function navigateToPage(page, url) {
    try {
        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle0' });
    } catch (err) {
        console.log(`Could not navigate to the page => : ${err}`);
    }
}

(async () => {
    // Start the browser and create a page instance
    let browser = await startBrowser();
    let page = await browser.newPage();

    // Navigate to the page
    await navigateToPage(page, 'https://hamrocsit.com/');

    // get all the semester links
    const semesterLinks = await page.$$eval('.category-area .container-fluid .row .col-md-6 a', links => links.map(link => link.href));

    // loop through each semester link
    for (let i = 0; i < semesterLinks.length; i++) {
        // ignore till the nth semester
        const ignoreSemester = 0;
        if (i < ignoreSemester) {
            continue;
        }
        
        // navigate to the semester page
        await navigateToPage(page, semesterLinks[i]);

        // get all the subject links
        const subjectLinks = await page.$$eval('.main_content .content_wrapper .card_main .card_footer_main a.btn', links => links.map(link => {
            let href = link.href;
            if (href.endsWith('/')) {
                return href.slice(0, -1);
            }
        }));
        
        console.log(subjectLinks);

        // loop through each subject link
        for (let j = 0; j < subjectLinks.length; j++) {
            // navigate to the subject page
            await navigateToPage(page, subjectLinks[j] + '/syllabus');

            // struct of the data to be extracted
            const data = {
                faculty: '',
                courseTitle: '',
                courseCode: '',
                semester: '',
                courseDescription: '',
                courseObjective: '',
                courseContents: [
                    {
                        orderNo: '',
                        topic: '',
                        lectureHours: '',
                        courseUrl: '',
                        subTopics: [
                            {
                                orderNo: '',
                                subTopic: '',
                            }
                        ]
                    }
                ],
                labWorks: '',
            };

            // extract the data
            // if the element is not found, skip it
            try {
                data.faculty = await page.$eval('.course-single .course-single-wrapper .course-single-tab .tab-content .syllabus_header p:nth-child(3)', el => el.textContent);
            } catch (err) {
                console.error('Error retrieving faculty:', err);
                continue;
            }
            data.courseTitle = await page.$eval('.course-single .course-single-wrapper .course-single-tab .tab-content .complete_header_syllabus .col-md-6:nth-child(1) .marks_header p:nth-child(1)', el => el.textContent.replace('Course Title: ', ''));
            data.courseCode = await page.$eval('.course-single .course-single-wrapper .course-single-tab .tab-content .complete_header_syllabus .col-md-6:nth-child(1) .marks_header p:nth-child(2)', el => el.textContent.replace('Course no: ', ''));
            data.semester = await page.$eval('.course-single .course-single-wrapper .course-single-tab .tab-content .complete_header_syllabus .col-md-6:nth-child(1) .marks_header p:nth-child(3)', el => {
                const romanSemester = el.textContent.replace('Semester: ', '');
                const semesters = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
                return semesters.indexOf(romanSemester) + 1;
            });
            data.courseDescription = await page.$eval('.course-single .course-single-wrapper .course-single-tab .tab-content .complete_header_syllabus .col-md-12 p:nth-child(1):not(strong)', el => el.textContent.replace('Course Description : ', '').trim());
            data.courseObjective = await page.$eval('.course-single .course-single-wrapper .course-single-tab .tab-content .complete_header_syllabus .col-md-12 p:nth-child(2):not(strong)', el => el.textContent.replace('Course Objective : ', '').trim());

            // get the course contents
            const courseContents = await page.$$('.course-single .course-single-wrapper .course-single-tab .tab-content .complete_header_syllabus .col-md-12 .syllabus_item');
            for (let k = 0; k < courseContents.length; k++) {
                data.courseContents[k] = data.courseContents[k] || {};
                data.courseContents[k].orderNo = k + 1;
                data.courseContents[k].topic = await courseContents[k].$eval('a h6:not(span)', el => 
                    el.textContent
                        .replace(/\n/g, '') // Remove newlines
                        .replace(/\d+\s+Hrs\.\s*/g, '') // Remove dynamic number followed by " Hrs."
                        .trim() // Remove leading and trailing whitespace
                );
                data.courseContents[k].lectureHours = await courseContents[k].$eval('a h6 span', el => el.textContent);
                data.courseContents[k].courseUrl = await courseContents[k].$eval('a', el => el.href);

                data.courseContents[k].subTopics = [];

                // subtopics are in a p, seperated by either ; or , or \n
                const subTopics = await courseContents[k].$eval('a p', el => el.textContent.split(/;|,|\n/));
                for (let l = 0; l < subTopics.length; l++) {
                    data.courseContents[k].subTopics[l] = {};
                    data.courseContents[k].subTopics[l].orderNo = l + 1;
                    data.courseContents[k].subTopics[l].subTopic = subTopics[l].trim();
                }
            }
            // Get the lab works
            try {
                const labWorksElement = await page.$('.course-single .course-single-wrapper .course-single-tab .tab-content .complete_header_syllabus .col-md-12 h5 ~ p');
                data.labWorks = labWorksElement ? await labWorksElement.evaluate(el => el.textContent.trim()) : '';
            } catch (err) {
                console.error('Error retrieving lab works:', err);
                data.labWorks = ''; // Set to empty if not found
            }
            
            const fs = require('fs');
            const path = require('path');

            // Define the directory path for data files
            const dataDir = path.join(__dirname, 'data');

            // Check if the data directory exists; if not, create it
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true }); // Create the directory if it doesn't exist
            }

            // filename should be the initials of each word in the faculty name
            const fileName = data.faculty.split(' ').map(word => {
                if (word.length > 3) {
                    return word[0];
                }
            }).join('').toLowerCase();

            const filePath = path.join(dataDir, fileName + '.md');

            // Append the data to the file if it exists
            // The file must contain the array of each semester's data
            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath);
                const jsonData = JSON.parse(fileData);
                // If the data for the semester, course code, and course title already exists, update it
                const courseIndex = jsonData.findIndex(item => item.courseCode === data.courseCode && item.courseTitle === data.courseTitle);
                if (courseIndex !== -1) {
                    jsonData[courseIndex] = data; // Update the data
                } else {
                    jsonData.push(data); // Add the data
                }
                fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2)); // Write updated data
            } else {
                // Create a new file and write the data
                const jsonData = [data];
                fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
            }

        }
    }

})();