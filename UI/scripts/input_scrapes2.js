// needs to spider through the entire website
// take all urls in the page, and then add them to the 'found_urls' array 
// take all urls in the page, and then add them to the 'visited websites' array.
    // if the url it's trying to go to is not inside the 'visited websites' array, it can go
    // if the url contains the root url, it scrapes it.

// on the saved_scrapes.html area, change it so that each folder in the 
// scrapes area is it's own table. Then, when you click on that table, it collapses.

async function spider_search(target_url, 
    sub_page_focus,
    text1,
    text2,
    text3)
{
    const UI_current_page = document.getElementById(text3)
    const UI_visited_page = document.getElementById(text1)
    const UI_scraped_page = document.getElementById(text2)

    const base_path = await find_base_path(target_url)
    let visited_urls = []
    visited_urls.push(target_url)

    // find all the urls contained in the page
    let found_urls = []
    found_urls = await find_subpages(target_url, found_urls, target_url, sub_page_focus)

    let found_url_count = 0
    for (let i=0; i < found_urls.length; i++)
    {
        let url = found_urls[i]
        UI_visited_page.textContent = "Visited " + i + " out of " + found_urls.length + " Pages"
        UI_current_page.textContent = "current url: " + url
        // if it hasn't been visited yet, and it shares a link with the starting page,
        // load it
        if (visited_urls.includes(url) === false)
        {
            visited_urls.push(url)
            const page_content = await load_page(url)

            // if it is what we are looking for, do the scrape here
            if (url.search(sub_page_focus) !== -1 ) 
            {
                const product_path = find_product_path(url, sub_page_focus, base_path)
                if(product_path !== 'skip')
                {
                    create_files(base_path, product_path, page_content, url)
                }
                found_url_count += 1
                UI_scraped_page.textContent = "found url count: " + found_url_count
            }

            let new_urls = await find_subpages(url, found_urls, target_url, sub_page_focus)

            found_urls = found_urls.concat(new_urls)
        }
    }
    UI_scraped_page.textContent = "Finished!"
}

async function find_base_path(URL)
{
    // remove https://www.
    let start = URL.search('www.') + 4
    let path = URL.slice(start)

    // remove the .com and anything after
    let end = path.search('.com')
    path = path.slice(0, end)

    // find where the scrapes are being stored, the put the folder in there
    const scrapesRoot = await window.nodeFunctions.getScrapesRoot()
    path = window.nodeFunctions.joinPath(scrapesRoot, path)

    return path
}

function isCrawlablePageUrl(absoluteUrl, baseHostname)
{
    const NON_PAGE_EXTENSIONS = new Set([
        '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico',
        '.css', '.js', '.mjs', '.map',
        '.pdf', '.zip', '.doc', '.docx', '.xls', '.xlsx',
        '.mp4', '.mp3', '.wav', '.woff', '.woff2', '.ttf', '.eot',
        '.xml', '.json', '.txt'
    ])
    let parsed
    try {
        parsed = new URL(absoluteUrl)
    } catch {
        return false
    }

    if (parsed.protocol !== 'https:') {
        return false
    }
    if (parsed.hostname !== baseHostname) {
        return false
    }

    const pathname = parsed.pathname.toLowerCase()
    const dot = pathname.lastIndexOf('.')
    if (dot !== -1) {
        const ext = pathname.slice(dot)
        if (NON_PAGE_EXTENSIONS.has(ext)) {
            return false
        }
    }

    return true
}

async function find_subpages(base_URL, previous_urls, target_url, sub_page_focus) {

    const home_page = await load_page(base_URL)
    const base = new URL(base_URL)

    const doc = new DOMParser().parseFromString(home_page, 'text/html')
    const found = new Set()

    for (const el of doc.querySelectorAll('a[href]')) {
        const raw = el.getAttribute('href')
        if (!raw ||
            raw.startsWith('#') ||
            raw.startsWith('mailto:') ||
            raw.startsWith('javascript:') ||
            raw.startsWith('tel:')
        ) {
            continue
        }

        let absolute
        try {
            absolute = new URL(raw, base).href
        } catch {
            continue
        }

        const kept_url = absolute.split('#')[0]

        // maybe change it so that it is rejected unless the url contains URL focus or starting URL
        if (isCrawlablePageUrl(kept_url, base.hostname) && 
            !previous_urls.includes(kept_url) &&
            (kept_url.includes(target_url) || kept_url.includes(sub_page_focus))
        ) {
            found.add(kept_url)
        }
    }

    return [...found]
}

function find_product_path(url, url_focus, base_path)
{
    console.log('finding product path')
    console.log('url focus is: ', url_focus)
    console.log('url is: ', url)
    let product_name = url.replace(url_focus, "") 
    let start = product_name.search("www.")
    if (start !== -1)
    product_name = product_name.split((start + 4))
    console.log("after being replaced, url is: ", product_name)
    

    let product_clean = product_name.replaceAll("/", " ")
    product_clean = product_clean.trim()
    console.log('product_clean is: ', product_clean)
    let product_array = product_clean.split(" ")
    console.log('product_array is: ', product_array)


    if (product_array.length > 1) {
        product_name = 'skip'
        return product_name
    }
    else{
        product_name = product_clean
    }

    const product_path = base_path + "/" + product_name
    return product_path
}

function create_files(base_path, product_path, product_content, url)
{
    console.log('creating a file! found in: ', product_path)

    if (!window.nodeFunctions.existsSync(base_path))
    {
        window.nodeFunctions.mkdirSync(base_path)
    }

    const scrape1 = product_path + '/' + 'scrape1'
    const scrape2 = product_path + '/' + 'scrape2'
    const scrape1_date_path = product_path + '/' + 'scrape1_date'
    const scrape2_date_path = product_path + '/' + 'scrape2_date'
    const url_path = product_path + '/' + 'url'

    const today = new Date()
    const scrape_date = 
        (today.getMonth() + 1) + '-' 
        + today.getDate() + '-' 
        + today.getFullYear()

    if (!window.nodeFunctions.existsSync(product_path))
    {
        window.nodeFunctions.mkdirSync(product_path)
    }

    window.nodeFunctions.createFile(url_path, url, 'utf-8')
    // if the information is not stored yet
    if (!window.nodeFunctions.existsSync(scrape1) && !window.nodeFunctions.existsSync(scrape2))
    {
        window.nodeFunctions.createFile(scrape1_date_path, scrape_date, 'utf-8')
        window.nodeFunctions.createFile(scrape1, product_content, 'utf-8')
        return
    }
    // if the website has been scraped previously
    else if (window.nodeFunctions.existsSync(scrape1) && !window.nodeFunctions.existsSync(scrape2))
    {
        window.nodeFunctions.createFile(scrape2_date_path, scrape_date, 'utf-8')
        window.nodeFunctions.createFile(scrape2, product_content, 'utf-8')
        return
    }
    // if everything is set up correctly
    else if (window.nodeFunctions.existsSync(scrape1) && window.nodeFunctions.existsSync(scrape2))
    {
        // set the scrape2 file to be scrape1
        const rewrtite_scrape1 = window.nodeFunctions.readFile(scrape2)
        window.nodeFunctions.createFile(scrape1, rewrtite_scrape1, 'utf-8')

        // do the same with the date
        const scrape1_date_path = product_path + '/' + 'scrape1_date'
        const scrape2_date_path = product_path + '/' + 'scrape2_date'
        const rewrtite_scrape1_date = window.nodeFunctions.readFile(scrape2_date_path)
        window.nodeFunctions.createFile(scrape1_date_path, rewrtite_scrape1_date, 'utf-8')

        // send the new scrape data into scrape2
        window.nodeFunctions.createFile(scrape2, product_content, 'utf-8')
        window.nodeFunctions.createFile(scrape2_date_path, scrape_date, 'utf-8')
        return
    }
    else
    {
        console.error('createFiles has failed')
    }
}

async function load_page(URL)
{    
    if (URL.startsWith('https://') === false)
    {
        URL = 'https://' + URL
    }
    let response = await fetch(URL); 

    try {
        let response_page = await response.text();
        return response_page
    }
    catch(error) {
        console.log(`Response status: ${response.status}`);
        return
    }
}

