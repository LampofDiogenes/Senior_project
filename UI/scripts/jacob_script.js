
// Goes through each page where product urls are mentioned
async function hobart_brothers( frontend_loading_tag, product_page_number, number_loaded_tag )
{

    const loading_tag = document.getElementById(frontend_loading_tag)
    const product_page_tag = document.getElementById(product_page_number)
    const number_tag = document.getElementById(number_loaded_tag)

    
    const base_URL = 'https://www.hobartbrothers.com/products/?_paged='
    const hobart_path = './UI/scrapes/hobartbrothers'
    const number_of_pages = 9

    loading_tag.textContent = 'Loading. Please do not close  or navigate from the page.'
    number_tag.textContent = 'Finding numer of pages to scrape...'
    
    
    // create a folder for hobart brothers in the scrapes folder
    if (!window.nodeFunctions.existsSync(hobart_path))
    {
        window.nodeFunctions.mkdirSync(hobart_path)
    }
    for (let i=1; i <= number_of_pages; i++)
    {
        product_page_tag.textContent = 'product page ' + i + ' out of ' + number_of_pages
        let URL = base_URL + i
        let product_page = await load_page(URL)

        // run page function
        await grab_products_from_page(product_page, hobart_path, number_tag)
        
    } 

    loading_tag.textContent = 'Loaded! '
}

// in the page where product urls are mentioned:
// pulls the product itself out
async function grab_products_from_page(product_page, hobart_path, number_tag)
{
    // since the html should return as a string,
    // split everything into words, and put them in an array
    let product_array = product_page.split("<")
    let url_focus = 'www.hobartbrothers.com/product/product-details'
    let found_urls = []

    for (let i =0; i < product_array.length; i++)
    {

        let unfiltered_url = product_array[i]

        // if anything in the array starts with 'href', go to that address
        if (unfiltered_url.includes('href="http') && unfiltered_url.includes(url_focus))
        {
            let url_beginning = unfiltered_url.indexOf('href="') + 6 // killing href="
            let url_end = unfiltered_url.length
            let target_url = product_array[i].slice(url_beginning, url_end)
            
            let new_url_end = target_url.indexOf('"') // removing everything after "

            // string should now have all data between href=" ... "
            // target url is the ... now
            target_url = target_url.slice(0, new_url_end)

            if (found_urls.includes(target_url) === false )
            {
                found_urls.push(target_url)
            }
        }
    }

    for (let x = 0; x < found_urls.length; x++)
    {
        
        // create a folder for the product itself
        target_url = found_urls[x]

        let product_name = target_url.replace(url_focus, "") 
        product_name = product_name.replace('https://', "")
        let product_path = hobart_path + product_name

        if (!window.nodeFunctions.existsSync(product_path))
        {
            window.nodeFunctions.mkdirSync(product_path)
        }
        await grab_table_from_product(target_url, product_path)
        number_tag.textContent = (x + 1) + ' out of ' + found_urls.length + ' scraped'
    }
    
}

async function grab_table_from_product(
    URL,
    product_path,
    target='id=available_products')
{
        // load the page
        let response_page = await load_page(URL)

        // split the page based on elements
        let array = response_page.split("<")
        let table_array = []
        let table_tracker = []


        // find the first table element
        for (let i=1; i < array.length; i++)
        {
            if (array[i].startsWith('table'))
            {
                table_array.push(array[i])
                table_tracker.push('table_start')
            }
            else if (array[i].startsWith('/table'))
            {
                table_array.push(array[i])
                table_tracker.push('table_end')
            }
        }
        
        
        // remove everything but the table
        let table = 'this page does not have a table'
        if ( table_array != [] )
        {
            let table_start = table_array[0]
            let table_end = table_array[1]

            // take the whole page, and slice it at the place where the table starts and ends
            let start_index = response_page.indexOf(table_start) - 6 // table back in
            let end_index = response_page.indexOf(table_end) + 7 // adding /table back in

            table = response_page.slice(start_index, end_index)

            createFiles(product_path, table)
        }  
}

// Performs the actual scrape
async function load_page(URL)
{    
    let response = await fetch(URL);
    // console.log(response); 
    if (!response.ok){
        throw new Error(`Response status: ${response.status}`);
    }
    let response_page = await response.text();
    return response_page
}

function get_scrape_date()
{
  const next_date = new Date()
  const next_scrape_date = 
    (next_date.getMonth() + 1) + '-' 
    + next_date.getDate() + '-' 
    + next_date.getFullYear()

  return next_scrape_date
};

function createFiles(product_path, product_content)
{

    const scrape_date = get_scrape_date()
    const scrape1 = product_path + '/' + 'scrape1'
    const scrape2 = product_path + '/' + 'scrape2'
    // if the information is not stored yet
    if (!window.nodeFunctions.existsSync(scrape1) && !window.nodeFunctions.existsSync(scrape2))
    {
        const scrape1_date_path = product_path + '/' + 'scrape1_date'

        window.nodeFunctions.createFile(scrape1_date_path, scrape_date, 'utf-8')
        window.nodeFunctions.createFile(scrape1, product_content, 'utf-8')
        return
    }
    // if the website has been scraped previously
    else if (window.nodeFunctions.existsSync(scrape1) && !window.nodeFunctions.existsSync(scrape2))
    {
        const scrape2_date_path = product_path + '/' + 'scrape2_date'

        window.nodeFunctions.createFile(scrape2_date_path, scrape_date, 'utf-8')
        window.nodeFunctions.createFile(scrape2, product_content, 'utf-8')
        return
    }
    // if everything is set up correctly
    else if (window.nodeFunctions.existsSync(scrape1) && window.nodeFunctions.existsSync(scrape2))
    {
        // set the scrape2 file to be scrape1
        const rewrtite_scrape1 = window.nodeFunctions.readFile(scrape2)
        window.nodeFunctions.createFile(scrape1, rewrtite_scrape1, 'utf-8')

        // do the same with the date
        const scrape1_date_path = product_path + '/' + 'scrape1_date'
        const scrape2_date_path = product_path + '/' + 'scrape2_date'
        const rewrtite_scrape1_date = window.nodeFunctions.readFile(scrape2_date_path)
        window.nodeFunctions.createFile(scrape1_date_path, rewrtite_scrape1_date, 'utf-8')

        // send the new scrape data into scrape2
        window.nodeFunctions.createFile(scrape2, product_content, 'utf-8')
        window.nodeFunctions.createFile(scrape2_date_path, scrape_date, 'utf-8')
        return
    }
    else
    {
        console.error('createFiles has failed')
    }
}