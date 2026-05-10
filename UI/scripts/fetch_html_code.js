const fs = require('fs');


async function fetch_html_code(URL)
{
    // debugging and prettifying
    console.clear();
    console.log("running scrape function");

    // contact the website 
    let response = await fetch(URL);
    console.log(response); // BUG : 'failed to load resource' - hobart_brothers
    if (!response.ok){
        throw new Error(`Response status: ${response.status}`);
    }
    let data = await response.text();

    // THESE NEED TO BE CODED
    const file_path = create_file(URL, data) // creates the path for the file


    console.log("html code has been fetched");
}

// Creates the path for the file
// INCOMPLETE!!!!
function create_file(URL, data)
{
    // Step 1  : if the website name starts with https : remove the first 13 characters,
    // Step 1a : if the website name starts with http : remove the first 12 characters instead
    // Step 2  : remove the last 4 characters at the end of the website.
    // Step 3  : convert any '/' to '-'
    // step 4  : set website name to the remaining characters


    // Step 5  : create the file in the scrapes folder
    // Step 6  : set the file_name to be the modified webite name
    // Step 7  : create the file.
    const file_name = "testing1"
    const content = data
    const format = 'UTF-8'

    // this is failing because the eapplication is trying
    // to import at runtime. Try using context bridge
    fs.writeFile(file_name, content, format)  
}