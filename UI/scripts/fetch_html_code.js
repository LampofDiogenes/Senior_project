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
    let webpage_html = await response.text();

    // THESE NEED TO BE CODED
    const file_path = create_file(URL) // creates the path for the file
    input_data(webpage_html, file_path) // populates the file with the data scraped


    console.log("html code has been fetched");
}

// Creates the path for the file
// INCOMPLETE!!!!
function create_file(website_name)
{
    // if the website name starts with https : remove the first 13 characters,
    // if the website name starts with http : remove the first 12 characters instead
    // remove the last 4 characters at the end of the website.
    // convert any '/' to '-'
    // set website name to the remaining characters
    // create the file in the scrapes folder
    // set the file_name to be the modified webite name
    // create the file.
}

// populates the file with the data that has been scraped
// INCOMPLETE!!!!
function input_data(data, file_path)
{
    // take the data from the scrape previously
    // insert all the data into the file made by create_file
}