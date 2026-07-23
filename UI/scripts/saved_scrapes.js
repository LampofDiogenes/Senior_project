// find the data in each of the subfolders (website_name)
// read the data, and compare the most recent date to the next most recent date
// determine if any change occured between those two dates

async function makeUI(dom_target) // asks for the folder to take info from, and place to put information into
{

    const root_path = await window.nodeFunctions.getScrapesRoot()
    if (!window.nodeFunctions.existsSync(root_path))
    {
        console.log('root folder not found')
        return
    }
    const items = window.nodeFunctions.readdirSync(root_path);
    
    // for each website folder, display it
    for (let i=0; i < items.length; i++)
    {
        
        let website_name = items[i]
        let website_path = window.nodeFunctions.joinPath(root_path, website_name)
        if (!window.nodeFunctions.existsSync(website_path))
        {
            break
        }
        
        let website_folder = window.nodeFunctions.readdirSync(website_path)
        
        for (let j=0; j < website_folder.length; j++)
        {
            let product_name = website_folder[j]
            let product_path = window.nodeFunctions.joinPath(website_path, product_name)

            let number = get_number(j)
            let url = get_url(product_path)
            let name = get_file_name(product_name)
            let status = compare_scrapes(product_path)
            let last_scrape_date = get_last_scrape_date(product_path, product_name)
            let next_scrape_date = get_next_scrape_date()
            // const scrape_frequency = get_scrape_frequency(root_path, product_name)

            let row = document.createElement('tr') // create a row
                row.appendChild(number)
                row.appendChild(name)
                row.appendChild(last_scrape_date)
                row.appendChild(next_scrape_date)
                row.appendChild(url)
                row.appendChild(status)
            dom_target.appendChild(row) // add the row to the table
        }
    }
}

function get_number(i)
{
    let number = document.createElement('td')
    number.textContent = i+1
    number.classList.add('table-element')
    return number
}
function get_file_name(file_name)
{
    let name = document.createElement('td') // set the element to be a table data
    name.classList.add('table-element')
    name.textContent = file_name  // make the element's content be the filename
    name.id = file_name // make the element have the name of the filename

    return name
}
function get_scrape_frequency(path, file_name)
{
    let scrape_frequency = document.createElement('td')
    const scrape_path = path + '/' + file_name + '/scrape_frequency'
    scrape_frequency.textContent = window.nodeFunctions.readFile(scrape_path)
    scrape_frequency.classList.add('table-element')

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
    last_scrape_date.classList.add('table-element')

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
                scrape_comparison.classList.add('throw-clear')
            }
            else
            {
                scrape_comparison.textContent = 'change detected'
                scrape_comparison.classList.add('throw-alarm')
            }
        }
    else if (window.nodeFunctions.existsSync(scrape1))
    {
        scrape_comparison.textContent = 'only one scrape detected'
        scrape_comparison.classList.add('throw-warning')
    }

    else
    {
        scrape_comparison.textContent = 'error'
    }

    return scrape_comparison

}
function get_url(product_path)
{
    let url = document.createElement('td')
    let url_path = product_path + '/' + 'url'

    if (window.nodeFunctions.existsSync(url_path))
    {
        url.textContent = window.nodeFunctions.readFile(url_path)
    }
    else
    {
        url.textContent = 'not found'
    }
    url.dataset.productPath = product_path
    url.classList.add('table-element')
    return url
}

// this gets inaccurate when looking past 2 years, but works pretty well within 1 year
// POTENTIAL BUG : might not account for leap years
function get_next_scrape_date(days=1)
{

  let next_date = new Date();
  next_date.setDate(next_date.getDate() + Math.abs(days));

  let next_scrape_date = document.createElement('td')
  next_scrape_date.textContent = (next_date.getMonth() + 1) + '/' + next_date.getDate() + '/' + next_date.getFullYear()
  next_scrape_date.classList.add('table-element')
  next_scrape_date.classList.add('table-element')

  return next_scrape_date
};

document.addEventListener('DOMContentLoaded', async () => {
      try {
        await makeUI(document.getElementById('data_table'))
      } catch (err) {
        console.error('makeUI failed:', err)
      }
    })