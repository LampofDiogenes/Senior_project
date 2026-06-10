// find the data in each of the subfolders (website_name)
// read the data, and compare the most recent date to the next most recent date
// determine if any change occured between those two dates

function makeUI(folder_path, dom_target) // asks for the folder to take info from, and place to put information into
{
    const folder = window.nodeFunctions.readdirSync(folder_path)
    website_path = folder_path + '/' + 'hobartbrothers'
    website_folder = window.nodeFunctions.readdirSync(website_path)
    
    for (let j=0; j < website_folder.length; j++)
    {
        const product_name = website_folder[j]
        const product_path = website_path + '/' + product_name


        const number = get_number(j)
        const name = get_file_name(product_name)
        const last_scrape_date = get_last_scrape_date(product_path, product_name)
        const next_scrape_date = get_next_scrape_date()
        const status = compare_scrapes(product_path)
        // const scrape_frequency = get_scrape_frequency(folder_path, product_name)

        let row = document.createElement('tr') // create a row
            row.appendChild(number)
            row.appendChild(name)
            row.appendChild(last_scrape_date)
            row.appendChild(next_scrape_date)
            row.appendChild(status)
        dom_target.appendChild(row) // add the row to the table
    }
}


function get_number(i)
{
    let number = document.createElement('td')
    let button = document.createElement('button')
    const number_content = i+1
    button.textContent = number_content
    number.appendChild(button)

    return number
}
function get_file_name(file_name)
{
    let name = document.createElement('td') // set the element to be a table data
    name.textContent = file_name  // make the element's content be the filename
    name.id = file_name // make the element have the name of the filename

    return name
}
function get_scrape_frequency(path, file_name)
{
    let scrape_frequency = document.createElement('td')
    const scrape_path = path + '/' + file_name + '/scrape_frequency'
    scrape_frequency.textContent = window.nodeFunctions.readFile(scrape_path)

    return scrape_frequency
}
function get_last_scrape_date(product_path, file_name)
{
    let last_scrape_date = document.createElement('td')
    let date_path = product_path + '/scrape2_date'

    if (!window.nodeFunctions.existsSync(date_path))
    {
        date_path = product_path + '/scrape1_date'
    }
    if(window.nodeFunctions.existsSync(date_path))
    {
        last_scrape_date.textContent = window.nodeFunctions.readFile(date_path)
    }
    else if (!window.nodeFunctions.existsSync(date_path))
    {
        last_scrape_date.textContent = 'Not Previously Scraped'
    }
    else
    {
        last_scrape_date.textContent = 'Error'
    }

    return last_scrape_date
}
function compare_scrapes(product_path)
{
    let scrape_comparison = document.createElement('td')
    let scrape1 = product_path + '/scrape1'
    let scrape2 = product_path + '/scrape2'

    if (window.nodeFunctions.existsSync(scrape1) && 
        window.nodeFunctions.existsSync(scrape2) )
        {
            let scrape1_data = window.nodeFunctions.readFile(scrape1)
            let scrape2_data = window.nodeFunctions.readFile(scrape2)

            if (scrape1_data === scrape2_data)
            {
                scrape_comparison.textContent = 'unchanged'
            }
            else
            {
                scrape_comparison.textContent = 'change detected'
            }
        }
    else if (window.nodeFunctions.existsSync(scrape1))
    {
        scrape_comparison.textContent = 'only one scrape detected'
    }

    else
    {
        scrape_comparison.textContent = 'error'
    }

    return scrape_comparison

}

// this gets inaccurate when looking past 2 years, but works pretty well within 1 year
// POTENTIAL BUG : might not account for leap years
function get_next_scrape_date(days=1)
{

  let next_date = new Date();
  next_date.setDate(next_date.getDate() + Math.abs(days));

  let next_scrape_date = document.createElement('td')
  next_scrape_date.textContent = (next_date.getMonth() + 1) + '/' + next_date.getDate() + '/' + next_date.getFullYear()

  return next_scrape_date
};