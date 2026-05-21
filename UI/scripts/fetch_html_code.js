// TO DO:
    // Needs to have only valid dates as an input
    // Needs to run a new scan at that new date
    // Would be REALLY IMPORTANT for the program to tell me WHERE the difference is


async function fetch_html_code(URL, scrape_frequency)
{
    // debugging and prettifying
    console.clear();
    console.log("running scrape function");

    // contact the website 
    const response = await fetch(URL);
    console.log(response); // BUG : 'failed to load resource' - hobart_brothers
    if (!response.ok){
        throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.text();

    // creates the file
    const folder_path = create_file(URL, data) 
    create_date_file(folder_path, scrape_frequency)
    create_timestamp_file(folder_path)
}

// FUTURE BUG!! 
// Will need to compare a file if the file already exists
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

    // make the scrape folder if it doesn't exist
    if (!window.nodeFunctions.existsSync("UI/scrapes"))
    { 
        window.nodeFunctions.mkdirSync("UI/scrapes")
    }

    // afterwards, set the file name to be the site name
    const folder_path = "UI/scrapes/" + URL_name

    // check to see if the file was correctly named
    if (URL_name === 'naming_fail') {
        console.error('Gnome failed to correctly name the file')
    }

    // check to see if the file already exists
    else if (window.nodeFunctions.existsSync(folder_path) ) {
        
        const content = data
        const format = 'UTF-8'
        const file_path = folder_path + "/" + 'scrape_2'
        window.nodeFunctions.createFile(file_path, content, format)

        console.log('Gnome detected that this file already exists')

        compare_scrapes(folder_path)
    }

    // create the file in UI/scrapes
    else{
        window.nodeFunctions.mkdirSync(folder_path)
        
        const content = data
        const format = 'UTF-8'
        const file_path = folder_path + "/" + 'scrape_1'
        window.nodeFunctions.createFile(file_path, content, format)

        console.log("html code has been fetched");
    }
    return folder_path
}

function create_date_file(folder_path, scrape_frequency) 
{
    const content = scrape_frequency
    const format = 'UTF-8'
    const file_path = folder_path + "/" + 'target_date'
    window.nodeFunctions.createFile(file_path, content, format)
}

function create_timestamp_file(folder_path)
{
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const day = today.getDate()


    const content = month + '/' + day + '/' + year
    const format = 'UTF-8'
    const file_path = folder_path + "/" + 'date_created'
    window.nodeFunctions.createFile(file_path, content, format)
}


function compare_scrapes(folder_path)
{
    const path1 = folder_path + '/scrape_1'
    const path2 = folder_path + '/scrape_2'

    const scrape1 = window.nodeFunctions.readFile(path1)
    const scrape2 = window.nodeFunctions.readFile(path2)

    if (scrape1 === scrape2)
    {
        console.log('nothing has changed between scrapes')
    }

    else
    {
        console.log('THERE HAS BEEN A CHANGE BETWEEN THE SCRAPES')
    }
}