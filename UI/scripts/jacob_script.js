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


function hobart_brothers()
{
    const base_URL = 'https://www.hobartbrothers.com/products/?_paged='

    for (let i=1; i < 11; i++)
    {
        // go to the product page
        let URL = base_URL + i
        let response = await fetch(URL);
        console.log(response); // BUG : 'failed to load resource' - hobart_brothers
        if (!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }
        let product_page = await response.text();

        // need to find the product itself:
            // make a for loop, finding each thing having "'fwpl-result r' + x"
            // go to that URL

                // In that for loop : 
                    // find the table with the id : ='available-products'
                    // this has the information that we need.
                    // store this information, and keep it in a place so we can compare again later
    }

    
}