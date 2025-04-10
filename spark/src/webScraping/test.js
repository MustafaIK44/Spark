// let webdriver = require("selenium-webdriver");
require("chromedriver");

// let driver = new webdriver.Builder().forBrowser("chrome").build();

// driver.get("https://www.target.com/p/grade-a-large-eggs-12ct-good-38-gather-8482-packaging-may-vary/-/A-14713534#lnk=sametab");

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function targetScrape(url) {
    let driver = await new Builder().forBrowser('chrome').build();
    
    try {
        await driver.get(url);
        
        let priceElement = await driver.wait(
            until.elementLocated(By.css('[data-test="product-price"]')),
            10000
        );

        // Extract and print the text from the element
        let priceText = await priceElement.getText();
        console.log('Product Price:', priceText);
       
    } finally {
        await driver.quit();
    }
};


async function walmartScrape(url) {
    let anan = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36";
    
    const options = new chrome.Options();
    options.addArguments(`--user-agent=${anan}`);

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    try {
        await driver.get(url);
        
        let priceElement = await driver.wait(
            until.elementLocated(By.css('[itemprop="price"]')),
            10000
        );

        // Extract and print the text from the element
        let priceText = await priceElement.getText();
        console.log('Product Price:', priceText);
       
    } finally {
        await driver.quit();
    }
};

async function targetSearch(url){
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(url);
        
        let searchbar = await driver.wait(
            until.elementLocated(By.css('[id="search"]')),
            10000
        );

        await searchbar.click();
        await searchbar.sendKeys("eggs\n");

        let productLinks = [];

        // Loop through products by selecting based on index attribute
        for (let i = 1; i <= 3; i++) {  // Target the first 3 products
            try {
                let product = await driver.wait(
                    until.elementLocated(By.css(`[data-test="product-grid"] [index="${i}"]`)),
                    5000
                );

                let linkElement = await product.findElement(By.css('a'));
                let href = await linkElement.getAttribute('href');
                productLinks.push(href);
            } catch (err) {
                console.log(`No product found at index ${i}`);
            }
        }

        for (let i = 0; i <3 ; i++){
            targetScrape(productLinks[i]);
        }

    } finally {
        driver.close();
    }
}

async function walmartSearch(url) {
    let anan = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0";
    
    const options = new chrome.Options();
    options.addArguments(`--user-agent=${anan}`);

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();


    try {
        await driver.get(url);
        setTimeout(10000);
        // let searchbar = await driver.wait(
        //     until.elementLocated(By.css('[id="search"]')),
        //     10000
        // );

        // await searchbar.click();
        // await searchbar.sendKeys("eggs\n");

        // let productLinks = [];

        // // Loop through products by selecting based on index attribute
        // for (let i = 1; i <= 3; i++) {  // Target the first 3 products
        //     try {
        //         let product = await driver.wait(
        //             until.elementLocated(By.css(`[data-test="product-grid"] [index="${i}"]`)),
        //             5000
        //         );

        //         let linkElement = await product.findElement(By.css('a'));
        //         let href = await linkElement.getAttribute('href');
        //         productLinks.push(href);
        //     } catch (err) {
        //         console.log(`No product found at index ${i}`);
        //     }
        // }

        // console.log("Product Links:", productLinks);

    } finally {
        driver.close();
    }
}

// targetURL = 'https://www.target.com/p/women-39-s-metal-aviator-round-sunglasses-wild-fable-8482-black/-/A-82888071#lnk=sametab';
// targetScrape(targetURL);

// walmartURL = "https://www.walmart.com/ip/Fresh-Clementines-3-lb-Bag/11025598https://www.walmart.com/ip/Cinnamon-Toast-Crunch-Breakfast-Cereal-Crispy-Cinnamon-Cereal-Family-Size-18-8-oz/207302221?classType=VARIANT&athbdg=L1200&from=/search";
// walmartScrape(walmartURL);

// target = 'https://www.target.com/';
// targetSearch(target);

// walmart = "https://www.walmart.com/"
// walmartSearch(walmart);
