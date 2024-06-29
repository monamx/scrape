const express = require('express');
const playwright = require('playwright-core');
const chromium = require('@sparticuz/chromium-min');

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/:target', async (req, res) => {
    const target = req.params.target;
    const url = `https://${target}`;
    
    let browser = null;
    
    try {
        browser = await playwright.chromium.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        const content = await page.content();
        
        res.send(content);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Something went wrong: ' + error.message);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
