// const { contextBridge } = require('electron');


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

// FUTURE BUG!! 
// Will need to check to see if the file already exists. If it does, it needs to compare instead
function create_file(URL, data)
{
    
    let URL_name = 'naming_fail'
    const first_letters = URL.slice(0,4)
    console.log(first_letters)

    // Step 1  : if the website name starts with https : remove the first 12 characters,
    // Step 1a : if the website name starts with http : remove the first 11 characters instead
    if (URL.slice(0, 4) === 'http')
    {

        // Step 2  : remove the last 4 characters at the end of the website.
        // step 4  : set website name to the remaining characters
        const array = URL.split("."); 
        URL_name = array[1];

        // Step 3  : convert any '/' to '-'
        URL_name = URL_name.replaceAll('/', '-');
    }
    
    // Step 5  : create the file, placing it into the scrapes folder
    const file_path = "UI/scrapes/" + URL_name
    const content = data
    const format = 'UTF-8'


    window.nodeFunctions.createFile(file_path, content, format)
}