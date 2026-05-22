// for each file in scrapes : 
    // create an entry in saved_scrapes.html that is clickable (button)

function makeUI(path, table)
{
    const folder = window.nodeFunctions.readdirSync(path)
    let file_name = 'error'

    for (let i = 0; i < folder.length; i++)
    {
        // number
        let number = document.createElement('td')
        const number_content = i+1
        number.textContent = number_content


        // filename
        file_name = folder[i] // find the file
        let name = document.createElement('td') // set the element to be a table data
        name.textContent = file_name  // make the element's content be the filename
        name.id = file_name // make the element have the name of the filename
        
        // Scrape Frequency
        let scrape_frequency = document.createElement('td')
        const scrape_path = path + '/' + file_name + '/scrape_frequency'
        scrape_frequency.textContent = window.nodeFunctions.readFile(scrape_path)

        let row = document.createElement('tr') // create a row
            row.appendChild(number)
            row.appendChild(name)
            row.appendChild(scrape_frequency)
        table.appendChild(row) // add the row to the table
    }
}