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

    // creates the file
    create_file(URL, data) 
}

// FUTURE BUG!! 
// Will need to check to see if the file already exists. If it does, it needs to compare instead
function create_file(URL, data)
{
    
    let URL_name = 'naming_fail'

    // check to make sure that the inputted website is still valid
    if (URL.slice(0, 4) === 'http')
    {
        // remove 'https:www.' and '.com'
        const array = URL.split("."); 
        URL_name = array[1];

        // convert any '/' to '-'
        URL_name = URL_name.replaceAll('/', '-');
    }

    const file_path = "UI/scrapes/" + URL_name

    // check to see if the file was correctly named
    if (URL_name === 'naming_fail') {
        console.error('Gnome failed to correctly name the file')
    }

    // check to see if the file already exists
    else if (window.nodeFunctions.existsSync(file_path) ) {
        console.error('Gnome detected that this file already exists')
    }

    // create the file in UI/scrapes
    else{
        const file_path = file_path
        const content = data
        const format = 'UTF-8'
        window.nodeFunctions.createFile(file_path, content, format)

        console.log("html code has been fetched");
    }
}