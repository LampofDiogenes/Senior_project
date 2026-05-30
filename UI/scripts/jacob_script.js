
// Goes through each page where product urls are mentioned
async function hobart_brothers( frontend_loading_tag )
{

    const base_URL = 'https://www.hobartbrothers.com/products/?_paged='
    const number_of_pages = 9 + 1
    const loading_tag = document.getElementById(frontend_loading_tag)
    const hobart_path = './UI/scrapes/hobartbrothers'

    loading_tag.textContent = 'Loading. Please do not close the page.'
    
    for (let i=1; i < number_of_pages; i++)
    {
        let URL = base_URL + i
        let product_page = await load_page(URL)
        
        // create a folder for hobart brothers in the scrapes folder
        if (!window.nodeFunctions.existsSync(hobart_path))
        {
            window.nodeFunctions.mkdirSync(hobart_path)
        }

        // run page function
        await grab_products_from_page(product_page, hobart_path)
    } 

    let date_address = hobart_path + '/date_created'
    let today = new Date()
    let date_content = 
        (next_date.getMonth() + 1) + '/' 
        + next_date.getDate() + '/' 
        + next_date.getFullYear()
    
    window.nodeFunctions.createFile(date_address, date_content, 'utf-8')

    let frequency_address = hobart_path + '/scrape_frequency'
    let frequency_content = 'Daily'
    window.nodeFunctions.createFile(frequency_address, frequency_content, 'utf-8')

    loading_tag.textContent = 'Loaded! '
}

// in the page where product urls are mentioned:
// pulls the product itself out
async function grab_products_from_page(product_page, hobart_path)
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
            found_urls.push(target_url)

            console.log(target_url)


            // create a folder for the product itself
            let product_name = target_url.replace(url_focus, "") 
            product_name = product_name.replace('https://', "")
            let product_path = hobart_path + product_name

            if (!window.nodeFunctions.existsSync(product_path))
            {
                window.nodeFunctions.mkdirSync(product_path)
            }

            await grab_table_from_product(target_url, product_path)
        }
    }
}

// WARNING! WILL OVERWRITE PREVIOUS SCRAPES CURRENTLY!!!
// grabs the table from the product
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
        }  

        // create a file in the product's folder
        // WARNING : will overwrite the previous scrape currently

        const scrape_date = get_scrape_date()
        const product_content = product_path + '/' + scrape_date
        window.nodeFunctions.createFile(product_content, table, 'utf-8')
}

// Performs the actual scrape
async function load_page(URL)
{
    // let response = await fetch(URL);
    // console.log(response);
    // if (!response.ok){
    //     throw new Error(`Response status: ${response.status}`);
    // }    
    // let response_page = await response.text()
    // return response_page

    
    let response = await fetch(URL);
    console.log(response); 
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