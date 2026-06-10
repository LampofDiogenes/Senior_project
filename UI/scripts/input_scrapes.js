
// Goes through each page where product urls are mentioned
async function hobart_brothers( frontend_loading_tag, product_page_number, number_loaded_tag )
{

    const loading_tag = document.getElementById(frontend_loading_tag)
    const product_page_tag = document.getElementById(product_page_number)
    const total_url_number = document.getElementById(number_loaded_tag)

    const base_URL = 'https://www.hobartbrothers.com/products/?_paged='
    const base_path = './UI/scrapes/hobartbrothers'
    const number_of_pages = 9

    loading_tag.textContent = 'Loading. Please do not close  or navigate from the page.'
    total_url_number.textContent = 'Finding numer of pages to scrape...'
    
    // create a folder for hobart brothers in the scrapes folder
    if (!window.nodeFunctions.existsSync(base_path))
    {
        window.nodeFunctions.mkdirSync(base_path)
    }

    const saved_based_path = base_path + '/base_path'
    if (!window.nodeFunctions.existsSync(saved_based_path))
    {
        window.nodeFunctions.createFile(saved_based_path, base_path, 'utf-8')
    }



    let url_list = []

    for (let i=1; i <= number_of_pages; i++)
    {
        product_page_tag.textContent = 'product page ' + i + ' out of ' + number_of_pages
        let URL = base_URL + i
        let product_page = await load_page(URL)

        // run page function
        url_list = grab_products_from_page(
            product_page, 
            total_url_number, 
            url_list)
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
        total_url_number.textContent = (x+1) + ' out of ' + url_list.length + ' pages loaded'
    }

    console.log('scraping all the urls')
    for (let j=0; j < url_data_list.length; j++)
    {
        url_data = url_data_list[j]
        url = url_list[j]
        product_path = find_product_path(url)
        grab_table_from_product(url_data, product_path)
    }
    
    

    loading_tag.textContent = 'Loaded! '
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

function find_product_path(url)
{
    const hobart_path = './UI/scrapes/hobartbrothers'
    const url_focus = 'www.hobartbrothers.com/product/product-details'
    let product_name = url.replace(url_focus, "") 
    product_name = product_name.replace('https://', "")

    let product_path = hobart_path + product_name
    return product_path
}

function get_scrape_date()
{
  const today = new Date()
  const today_string = 
  (today.getMonth() + 1) + '-' 
    + today.getDate() + '-' 
    + today.getFullYear()

  return today_string
}

function createFiles(product_path, product_content)
{
    const scrape_date = get_scrape_date()
    const scrape1 = product_path + '/' + 'scrape1'
    const scrape2 = product_path + '/' + 'scrape2'
    const scrape1_date_path = product_path + '/' + 'scrape1_date'
    const scrape2_date_path = product_path + '/' + 'scrape2_date'

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
    let response = await fetch(URL);
    // console.log(response); 
    if (!response.ok){
        throw new Error(`Response status: ${response.status}`);
    }
    let response_page = await response.text();
    return response_page
}