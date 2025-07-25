const cron = require('node-cron');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

const urls = [
    "https://www.walmart.com/search?q=10450893",
    "https://www.walmart.com/search?q=15754233",
    "https://www.walmart.com/search?q=15570903",
    "https://www.walmart.com/search?q=10450909",
    "https://www.walmart.com/search?q=10450904",
    "https://www.walmart.com/search?q=317759802",
    "https://www.walmart.com/search?q=10450894",
    "https://www.walmart.com/search?q=10450899"
];

const skus = ["10450893", "15754233", "15570903", "10450909", "10450904", "317759802", "10450894", "10450899"];

// Main scraping function
async function runScraper() {
    console.log(`\n⏱Scraper started at ${new Date().toLocaleString()}`);

    // const browser = await puppeteer.launch({ headless: true });
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

    const page = await browser.newPage();
    let allData = [];

    async function scrapeUrls(index = 0) {
        if (index >= urls.length) return;

        const url = urls[index];
        const sku = skus[index];

        try {
            console.log(`Scraping URL (${index + 1}/${urls.length}): ${url}`);

            await new Promise(resolve => setTimeout(resolve, 5000));
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

            const data = await page.evaluate((currentSku) => {
                const results = [];
                const titleElement = document.querySelector('span[data-automation-id="product-title"]');
                const title = titleElement?.innerText || 'N/A';

                const attributeValue = `a[link-identifier="${currentSku}"]`;
                const linkElement = document.querySelector(attributeValue);
                let link = linkElement?.getAttribute('href') || 'N/A';
                if (link !== 'N/A') {
                    link = 'https://www.walmart.com' + link;
                }

                const productDivs = document.querySelectorAll('div[data-automation-id="product-price"]');
                productDivs.forEach(div => {
                    const priceSpan = div.querySelector('.w_iUH7');
                    const price = priceSpan?.innerText || 'N/A';
                    results.push({ Date: new Date().toISOString(), title, price, link });
                });

                return results;
            }, sku);

            console.log(`Scraped data:`, data);
            allData.push(...data);
        } catch (err) {
            console.error(`Error scraping ${url}: ${err.message}`);
        }

        await scrapeUrls(index + 1);
    }

    await scrapeUrls();

    await browser.close();

    fs.writeFileSync('walmart-data.json', JSON.stringify(allData, null, 2));
    console.log('Data saved to walmart-data.json');

    const csvPath = 'walmart-data.csv';
    const headers = ['Date', 'Title', 'Price', 'Link'];

    function convertToCSV(data) {
        return data.map(row =>
            `${row.Date},"${row.title.replace(/"/g, '""')}","${row.price.replace(/"/g, '""')}",${row.link}`
        ).join('\n');
    }

    if (!fs.existsSync(csvPath)) {
        fs.writeFileSync(csvPath, headers.join(',') + '\n', 'utf8');
    }

    const csvData = convertToCSV(allData) + '\n';
    fs.appendFileSync(csvPath, csvData, 'utf8');

    console.log('CSV data appended to walmart-data.csv');
    console.log('Scraping Completed at', new Date().toLocaleString());
}

runScraper();

// // 2️⃣ Schedule to run every Friday at 9:00 AM
// cron.schedule('0 9 * * 5', () => {
//     console.log('\n🔁 Scheduled run triggered!');
//     runScraper();
// });


// cron.schedule('*/2 * * * *', () => {
//     console.log('\nScheduled run triggered!');
//     runScraper();
// });