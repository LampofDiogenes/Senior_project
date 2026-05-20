// for each file in scrapes : 
    // create an entry in saved_scrapes.html that is clickable (button)

// create a format that this js file can take and populate with data
// insert a copy of each of these copied formats to be inserted into the html file
// insert divs into saved scrapes via javascript

function makeUI(path, table)
{
    const folder = window.nodeFunctions.readdirSync(path)
    let file_name = 'error'

    for (let i = 0; i < folder.length; i++)
    {

        file_name = folder[i] // find the file
        let element = document.createElement('td') // set the element to be a table data
        element.textContent = i + '.) ' + file_name  // make the element's content be the filename
        element.id = file_name // make the element have the name of the filename
        
        let row = document.createElement('tr') // create a row
        row.appendChild(element) // put the element in a row
        table.appendChild(row) // add the row to the table
    }
}