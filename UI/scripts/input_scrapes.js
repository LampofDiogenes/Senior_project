
// takes home url
// finds 9 sub-urls beneath it
// looks for sub-sub-urls
// takes only the sub-sub-urls that have the sub-url inside it
// if that sub-sub-url has a table, it records it


async function hobart_brothers( 
    base_URL, 
    frontend_loading_tag, 
    product_page_number, 
    number_loaded_tag )
{
    // deciding if the function should run
    const trimmed_URL =  base_URL.replace(/^\s+|\s+$/gm,'');
    if (trimmed_URL === '')
    {
        // backup if changed : 'https://www.hobartbrothers.com/products/?_paged='
        base_URL = 'https://www.hobartbrothers.com/products/?_paged='
    }
    else
    {
        else_function(base_URL, frontend_loading_tag, product_page_number, number_loaded_tag)
        return
    }

    // continuing with the function (setting variables)
    const UI_loading_tag = document.getElementById(frontend_loading_tag)
    const UI_product_page_tag = document.getElementById(product_page_number)
    const UI_total_url_number = document.getElementById(number_loaded_tag)

    const base_path = find_base_path(base_URL)

    UI_loading_tag.textContent = 'Loading. Please do not close  or navigate from the page.'
    UI_total_url_number.textContent = 'Finding numer of pages to scrape...'
    
    // create a folder for the website in the scrapes folder
    if (!window.nodeFunctions.existsSync(base_path))
    {
        window.nodeFunctions.mkdirSync(base_path)
    }

    let url_list = []

    // ERROR : THIS NEEDS TO CHANGE OVER HERE IN ORDER TO BECOME UNIVERSAL
    // const target_URLS = await find_subpages(base_URL)
    // const number_of_pages = target_URLS.length

    const number_of_pages = 9
    let target_URLS = []
    
    // ??? this is somehow gettings all the URLs already. HOW????
    console.log('target_URLS is : ', target_URLS) 

    for (let i=1; i <= number_of_pages; i++)
    {
        UI_product_page_tag.textContent = 'product page ' + i + ' out of ' + number_of_pages
        let URL = base_URL + i
        let product_page = await load_page(URL)

        // run page function
        url_list = grab_products_from_page(
            product_page, 
            UI_total_url_number, 
            target_URLS)
    }

    let url = String;
    let product_path = String;
    let url_data = String;
    let url_data_list = [];
    
    console.log('making requests to all the urls')
    for (let x=0; x < url_list.length; x++)
    {
        url = url_list[x]
        url_data = await load_page(url)
        url_data_list.push(url_data)
        UI_total_url_number.textContent = (x+1) + ' out of ' + url_list.length + ' pages loaded'
    }

    console.log('scraping all the urls')
    for (let j=0; j < url_data_list.length; j++)
    {
        url_data = url_data_list[j]
        url = url_list[j]
        product_path = find_product_path(url)
        grab_table_from_product(url_data, url)
    }
    UI_loading_tag.textContent = 'Loaded! '
}

function find_base_path(URL)
{
    // remove https://www.
    let start = URL.search('www.') + 4
    let path = URL.slice(start)

    // remove the .com and anything after
    let end = base_path.search('.com')
    path = base_path.slice(0, end)

    // add the remainder to the end of ./UI/scrapes/
    path = window.nodeFunctions.dirname + '/UI/scrapes/' + path
    console.log('base_path is : ', path)
    return path
}

async function find_subpages(base_URL)
{
    let home_page = await load_page(base_URL)
    let url_array = []

    console.log(base_URL)
    console.log(home_page)
    console.log('home_page.search() returned : ', home_page.search(base_URL))
    while (home_page.search(base_URL) != -1 )
    {
        url_position = home_page.search(base_URL)
        home_page = home_page.slice(url_position)
        url_end = home_page.search('"')
        let url = home_page.slice(0, url_end)

        if (url_array.includes(url) === false)
        {
            url_array.push(url)
            console.log("added ", url, " to the list")
        }
    }

    return url_array
}

// in the page where product urls are mentioned:
// pulls the product itself out
function grab_products_from_page(product_page, number_tag, found_urls)
{
    // since the html should return as a string,
    // split everything into words, and put them in an array
    let product_array = product_page.split("<")
    let url_focus = 'www.hobartbrothers.com/product/product-details'

    for (let i =0; i < product_array.length; i++)
    {
        let unfiltered_url = product_array[i]

        // if anything in the array starts with 'href', go to that address
        if (unfiltered_url.includes('href="http') && unfiltered_url.includes(url_focus))
        {
            // finding only the website name from the tag
            let url_beginning = unfiltered_url.indexOf('href="') + 6
            let url_end = unfiltered_url.length
            let target_url = product_array[i].slice(url_beginning, url_end)
            let new_url_end = target_url.indexOf('"')
            target_url = target_url.slice(0, new_url_end)

            if (found_urls.includes(target_url) === false )
            {
                found_urls.push(target_url)
            }
        }
    }
    return found_urls
}

function find_product_path(url)
{
    const hobart_path = './UI/scrapes/hobartbrothers'
    const url_focus = 'www.hobartbrothers.com/product/product-details'
    let product_name = url.replace(url_focus, "") 
    product_name = product_name.replace('https://', "")

    const product_path = hobart_path + product_name
}

function grab_table_from_product(
    url_data,
    product_path,
    target='id=available_products')
{

        // split the page based on elements
        let array = url_data.split("<")
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
            let start_index = url_data.indexOf(table_start) - 6 // table back in
            let end_index = url_data.indexOf(table_end) + 7 // adding /table back in

            table = url_data.slice(start_index, end_index)
            createFiles(product_path, table)
        }  
}

function createFiles(product_path, product_content)
{
    
    const scrape1 = product_path + '/' + 'scrape1'
    const scrape2 = product_path + '/' + 'scrape2'
    const scrape1_date_path = product_path + '/' + 'scrape1_date'
    const scrape2_date_path = product_path + '/' + 'scrape2_date'

    const today = new Date()
    const scrape_date = 
        (today.getMonth() + 1) + '-' 
        + today.getDate() + '-' 
        + today.getFullYear()

    if (!window.nodeFunctions.existsSync(product_path))
    {
        window.nodeFunctions.mkdirSync(product_path)
    }
    // if the information is not stored yet
    if (!window.nodeFunctions.existsSync(scrape1) && !window.nodeFunctions.existsSync(scrape2))
    {
        window.nodeFunctions.createFile(scrape1_date_path, scrape_date, 'utf-8')
        window.nodeFunctions.createFile(scrape1, product_content, 'utf-8')
        return
    }
    // if the website has been scraped previously
    else if (window.nodeFunctions.existsSync(scrape1) && !window.nodeFunctions.existsSync(scrape2))
    {
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

async function load_page(URL)
{    
    console.log(URL)
    if (URL.startsWith('https://') === false)
    {
        URL = 'https://' + URL
    }
    console.log(URL)
    let response = await fetch(URL);
    // console.log(response); 
    if (!response.ok){
        throw new Error(`Response status: ${response.status}`);
    }
    let response_page = await response.text();
    return response_page
}