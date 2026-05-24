// have each products page be a target
// 	- in each products page, add each product as a target
// 	- for each target:
// 		- take down all the information in 'available-products'
// 		- record it for the next scrape
// 		- basically just copy / paste anything between <td> and </td>

// for (let i=1; i < 10; i++) : 
// 	- target_url = 'https://www.hobartbrothers.com/products/?paged=' + i
	
// 	for (let x=1; x < table.length; x++)
// 	- product = 'fwpl-result r' + x
// 		- find href in this section

// 	- table id='available-products'
		// take all <td> from this
		// store this information

async function hobart_brothers(
    base_URL = 'https://www.hobartbrothers.com/products/?_paged=',
    number_of_pages = 2 // change to 11
)
{

    for (let i=1; i < number_of_pages; i++)
    {
        // go to the product page
        let URL = base_URL + i
        let response = await fetch(URL);
        console.log(response); // BUG : 'failed to load resource' - hobart_brothers
        if (!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }
        let product_page = await response.text();

        console.log('function hobart brothers has run')
        grab_individual_products(product_page)
    }

    
}

// need to find the product itself:
// make a for loop, finding each thing having "'fwpl-result r' + x"
// this finds the product itself
// go to that URL 
function grab_individual_products(product_page)
{
    // since the html should return as a string,
    // split everything into words, and put them in an array
    let product_array = product_page.split("<")

    for (let i =0; i < product_array.length; i++)
    {
        // if anything in the array starts with 'href', go to that address
        if (product_array[i].includes('href="http'))
        {
            let unfiltered_url = product_array[i]

            // console.log('unfiltered : ', unfiltered_url)


            let url_beginning = unfiltered_url.indexOf('href="') + 6 // killing href="
            let url_end = unfiltered_url.length
            let target_url = product_array[i].slice(url_beginning, url_end)
            let new_url_end = target_url.indexOf('"')

            target_url = target_url.slice(0, new_url_end)

            console.log('filtered: ', target_url)
            // console.log(" ")
            //grab_table_from_product(target_url)
        }
    }
    console.log('grab_individual_products function completed')
}

// find the table with the id : ='available-products'
// this has all the sub-products (information we want)
// store this information, and keep it in a place so we can compare again later
async function grab_table_from_product(
    URL='NEED TO ADD SOMETHING HERE',
    target='id=available_products')
{
        // load the page
        let response = await fetch(URL);
        console.log(response);
        if (!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }    
        let response_page = await response.text()


        // split the page based on elements
        let array = response_page.split("<")
        console.log(array)
        let table_start = -1
        let table_end = -1


        // find the first table element
        for (let i=1; i < array.length; i++)
        {
            if (array[i].includes('table') && table_start === NaN)
            {
                console.log('table_start is : ', array[i])
                table_start = array[i]
            }
            else if (array[i].includes('/table') && table_end === NaN)
            {
                console.log('table_end is : ', array[i])
                table_end = array[i]
                break
            }
        }

        // remove everything but the table
        if ((table_start !== -1) && (table_end !== -1))
        {
            console.log('table_start is : ', table_start)
            console.log('table_end is : ', table_end)
            array = array.slice(table_start, table_end)
            // log the table (later we are going to put this in a file)
            console.log('the table of this product is: ', array)
        }
        else
        {
            console.log('this page does not have a table')
        }    
}