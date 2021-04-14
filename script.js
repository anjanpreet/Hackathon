const puppeteer = require('puppeteer');
let fs = require('fs');
let q = process.argv[2];
(async () => {
    let movieUrl = "https://www.imdb.com";
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false
    });
    let tabs = await browser.pages();
    let tab = tabs[0];
    //const page = await browser.newPage();
    await tab.goto(movieUrl);



    await tab.type("#suggestion-search", q);
    await tab.click('button[type="submit"]');
    await tab.waitForNavigation({ waitUntil: "networkidle0" });
    await tab.waitForSelector(".findList td.primary_photo");
    await tab.click(".findList td.primary_photo");
    await tab.waitForSelector(".title_wrapper h1")
    let title = await tab.$eval(".title_wrapper h1", ele => ele.textContent);
    let rating = await tab.$eval("div.ratingValue strong", ele => ele.title);
    let trailerLink = await tab.$eval("div.slate a", ele => ele.href);
    let data = {
        Movie_name: title,
        Movie_rating: rating,
        Movie_trailerLink: trailerLink
    }
    console.log(data);



    let movieList = fs.readFileSync("movieList.txt", "utf-8");
    let urls = movieList.split("\r\n");
    for (let i = 0; i < urls.length; i++) {
        await tab.goto(urls[i]);
        let data1 = await tab.evaluate(() => {

            let title = document.querySelector("div.title_wrapper h1").innerText;
            let rating = document.querySelector("div.ratingValue strong").getAttribute("title");
            let trailerLink = document.querySelector("div.slate a").getAttribute("href");
            return {
                title,
                rating,
                trailerLink

            }

        });

        console.log(data1);
    }



    await browser.close();
})();

