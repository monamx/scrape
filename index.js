const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/:target', async (req, res) => {
    const target = req.params.target;
    const url = `https://${target}`;

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const content = await page.content();
        await browser.close();

        res.send(content);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Something went wrong!');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
