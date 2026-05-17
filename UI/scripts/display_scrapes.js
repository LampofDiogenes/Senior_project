

// for each file in scrapes : 
    // create an entry in saved_scrapes.html that is clickable (button)

// create a format that this js file can take and populate with data
// insert a copy of each of these copied formats to be inserted into the html file
// insert divs into saved scrapes via javascript


function readfiles(path)
{
    // Source - https://stackoverflow.com/a/62602038
    // Posted by dreamLo
    // Retrieved 2026-05-15, License - CC BY-SA 4.0
    const length = window.nodeFunctions.readdirSync(path).length
    const folder = window.nodeFunctions.readdirSync(path)
    console.log(length)
    console.log(folder)
}

function makeUI(path, parent_div)
{
    const folder = window.nodeFunctions.readdirSync(path)
    let file_name = 'error'

    for (let i = 0; i < folder.length; i++)
    {
        file_name = folder[i] // find the file
        let element = document.createElement(file_name) // make the element have the name of the filename
        element.textContent = file_name // make the element's content be the filename
        parent_div.appendChild(element) // add the element to the DOM
    }
    
}