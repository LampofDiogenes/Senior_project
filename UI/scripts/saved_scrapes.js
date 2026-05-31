
// GOAL : 
// find the data in each of the subfolders (website_name)
// read the data, and compare the most recent date to the next most recent date
// determine if any change occured between those two dates

function makeUI(folder_path, dom_target) // asks for the folder to take info from, and place to put information into
{
    const folder = window.nodeFunctions.readdirSync(folder_path)
    let website_folder = 'error'

    for (let i = 0; i < folder.length; i++)
    {
        website_folder = folder_path + '/' + folder[i] // find the file
        console.log('website folder : ', website_folder)

        let website_path = window.nodeFunctions.readdirSync(website_folder)
        for (let j=0; j < website_folder.length; j++)
        {
            let product_folder = website_folder + '/' + website_path[j]
            product_folder = window.nodeFunctions.readdirSync(product_folder)
            
            for (let x=0; x < product_folder.length; x++) // this is for comparing scrapes to see if anything is different
            {
                let product = product_folder[x]


                const number = get_number(j)
                const name = get_file_name(product)
                const scrape_frequency = get_scrape_frequency(folder_path, product)
                const last_scrape_date = get_last_scrape_date(folder_path, product)
                const next_scrape_date = get_next_scrape_date()

                let row = document.createElement('tr') // create a row
                    row.appendChild(number)
                    // row.appendChild(Parent_website)
                    row.appendChild(name)
                    row.appendChild(scrape_frequency)
                    row.appendChild(last_scrape_date)
                    row.appendChild(next_scrape_date)
                    // row.appendChild(did_change_occur)
                dom_target.appendChild(row) // add the row to the table
                
            
                let new_scrape_data = window.nodeFunctions.readFile(specific_scrape_instance)
            }
        }
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
function get_last_scrape_date(path, file_name)
{
    let last_scrape_date = document.createElement('td')
    const date_path = path + '/' + file_name + '/date_created'
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