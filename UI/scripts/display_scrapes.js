// for each file in scrapes : 
    // create an entry in saved_scrapes.html that is clickable (button)

function makeUI(path, table)
{
    const folder = window.nodeFunctions.readdirSync(path)
    let file_name = 'error'

    for (let i = 0; i < folder.length; i++)
    {
        file_name = folder[i] // find the file

        const number = get_number(i)
        const name = get_file_name(file_name)
        const scrape_frequency = get_scrape_frequency(path, file_name)
        const last_scrape_date = get_last_scrape_date(path, file_name)
        const next_scrape_date = get_next_scrape_date()

        let row = document.createElement('tr') // create a row
            row.appendChild(number)
            row.appendChild(name)
            row.appendChild(scrape_frequency)
            row.appendChild(last_scrape_date)
            row.appendChild(next_scrape_date)
        table.appendChild(row) // add the row to the table
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