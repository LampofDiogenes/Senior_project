// find the data in each of the subfolders (website_name)
// read the data, and compare the most recent date to the next most recent date
// determine if any change occured between those two dates

async function makeUI(dom_target)
{
    const root_path = await window.nodeFunctions.getScrapesRoot()
    if (!window.nodeFunctions.existsSync(root_path))
    {
        console.log('root folder not found')
        return
    }

    const items = window.nodeFunctions.readdirSync(root_path)

    for (let i = 0; i < items.length; i++)
    {
        const website_name = items[i]
        const website_path = window.nodeFunctions.joinPath(root_path, website_name)

        if (!window.nodeFunctions.isDirectory(website_path))
        {
            continue
        }

        const website_folder = window.nodeFunctions.readdirSync(website_path)

        for (let j = 0; j < website_folder.length; j++)
        {
            const product_name = website_folder[j]
            const product_path = window.nodeFunctions.joinPath(website_path, product_name)

            if (!window.nodeFunctions.isDirectory(product_path))
            {
                continue
            }

            try
            {
                const row = document.createElement('tr')
                row.dataset.productPath = product_path
                row.appendChild(get_number(j))
                row.appendChild(get_file_name(product_name))
                row.appendChild(get_last_scrape_date(product_path))
                row.appendChild(get_next_scrape_date())
                row.appendChild(get_url(product_path))
                row.appendChild(get_status_placeholder())
                dom_target.appendChild(row)
            }
            catch (err)
            {
                console.error('Failed to build row for', product_path, err)
            }
        }
    }

    await fillScrapeStatuses(dom_target)
}

async function fillScrapeStatuses(dom_target)
{
    const rows = dom_target.querySelectorAll('tr')
    let dataRowIndex = 0

    for (let i = 1; i < rows.length; i++)
    {
        const statusCell = rows[i].lastElementChild
        if (!statusCell)
        {
            continue
        }

        try
        {
            applyCompareResult(statusCell, compare_scrapes(rows[i].dataset.productPath))
        }
        catch (err)
        {
            console.error('compare_scrapes failed for row', i, err)
            statusCell.textContent = 'error'
        }

        dataRowIndex++
        if (dataRowIndex % 5 === 0)
        {
            await new Promise(resolve => setTimeout(resolve, 0))
        }
    }
}

function get_status_placeholder()
{
    const status = document.createElement('td')
    status.textContent = 'checking...'
    status.classList.add('table-element')
    return status
}

function applyCompareResult(statusCell, result)
{
    statusCell.textContent = result.text
    statusCell.classList.remove('throw-clear', 'throw-alarm', 'throw-warning')
    if (result.className)
    {
        statusCell.classList.add(result.className)
    }
}

function get_number(i)
{
    let number = document.createElement('td')
    number.textContent = i + 1
    number.classList.add('table-element')
    return number
}

function get_file_name(file_name)
{
    let name = document.createElement('td')
    name.classList.add('table-element')
    name.textContent = file_name
    return name
}

function get_last_scrape_date(product_path)
{
    let last_scrape_date = document.createElement('td')
    let date_path = product_path + '/scrape2_date'

    if (!window.nodeFunctions.existsSync(date_path))
    {
        date_path = product_path + '/scrape1_date'
    }

    if (window.nodeFunctions.existsSync(date_path))
    {
        last_scrape_date.textContent = window.nodeFunctions.readFile(date_path)
    }
    else
    {
        last_scrape_date.textContent = 'Not Previously Scraped'
    }

    last_scrape_date.classList.add('table-element')
    return last_scrape_date
}

function normalizeScrapeHtml(html)
{
    return html
        .replace(/data-cfemail="[^"]*"/gi, 'data-cfemail=""')
        .replace(/\/cdn-cgi\/l\/email-protection#[a-f0-9]+/gi, '/cdn-cgi/l/email-protection')
}

function compare_scrapes(product_path)
{
    const scrape1 = product_path + '/scrape1'
    const scrape2 = product_path + '/scrape2'

    if (window.nodeFunctions.existsSync(scrape1) &&
        window.nodeFunctions.existsSync(scrape2))
    {
        const size1 = window.nodeFunctions.fileSize(scrape1)
        const size2 = window.nodeFunctions.fileSize(scrape2)

        if (size1 !== size2)
        {
            return { text: 'change detected', className: 'throw-alarm' }
        }

        const scrape1_data = window.nodeFunctions.readFile(scrape1)
        const scrape2_data = window.nodeFunctions.readFile(scrape2)
        const normalized1 = normalizeScrapeHtml(scrape1_data)
        const normalized2 = normalizeScrapeHtml(scrape2_data)

        if (normalized1 === normalized2)
        {
            return { text: 'unchanged', className: 'throw-clear' }
        }

        return { text: 'change detected', className: 'throw-alarm' }
    }

    if (window.nodeFunctions.existsSync(scrape1))
    {
        return { text: 'only one scrape detected', className: 'throw-warning' }
    }

    return { text: 'error' }
}

function get_url(product_path)
{
    let url = document.createElement('td')
    let url_path = product_path + '/url'

    if (window.nodeFunctions.existsSync(url_path))
    {
        url.textContent = window.nodeFunctions.readFile(url_path)
    }
    else
    {
        url.textContent = 'not found'
    }

    url.classList.add('table-element')
    return url
}

function get_next_scrape_date(days = 1)
{
    let next_date = new Date()
    next_date.setDate(next_date.getDate() + Math.abs(days))

    let next_scrape_date = document.createElement('td')
    next_scrape_date.textContent =
        (next_date.getMonth() + 1) + '/' + next_date.getDate() + '/' + next_date.getFullYear()
    next_scrape_date.classList.add('table-element')

    return next_scrape_date
}

document.addEventListener('DOMContentLoaded', async () => {
    try
    {
        await makeUI(document.getElementById('data_table'))
    }
    catch (err)
    {
        console.error('makeUI failed:', err)
    }
})
