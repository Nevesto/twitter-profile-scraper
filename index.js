const pup = require('puppeteer');
const fs = require('fs');
require('dotenv').config();

//getting cache of navigator to stay logged in.
const dir = __dirname + './cache';

async function main() {
    
    // Teamplate function
    function print(prhase) {
        console.log(prhase);
    };
    
    async function init() {
        const browser = await pup.launch({headless:false, userDataDir:dir,}); //headless bug, i will fix it i promisse (:
        const page = await browser.newPage();
        return [browser, page]
    };

    async function goToUrl(pupPage, url) {
        await pupPage.goto(url);
    };
    
    async function writeById(pupPage, id, word) {
        await pupPage.type(id, word);
    };

    async function clickElement(pupPage, id) {
        await pupPage.click(id);
    };
    
    async function getImage(pupPage, id) {
        const imgUrl = await pupPage.$eval(id, img => img.getAttribute('src'));
        return imgUrl
    };

    async function wait(pupPage, time) {
        await pupPage.waitForTimeout(time);
    };
    
    // going to profile 
    let scopeVariables = await init();
    const browser = scopeVariables[0];
    const page = scopeVariables[1];
    await goToUrl(page, process.env.TRAVEL_URL);
    print('Bot iniciado.');
    await wait(page, 4000);
    await clickElement(page, process.env.FIND_BUTTON);
    await wait(page, 4000);
    await writeById(page, process.env.TYPE_USER, process.env.TWITTER_PROFILE);
    await wait(page, 4000);
    await clickElement(page, process.env.PROFILE_CLICK);
    
    // gets the src attribute of the img html tag
    await wait(page, 4000);
    const pfpUrl = await getImage(page, process.env.PFP);
    print(pfpUrl);
    const bannerUrl = await getImage(page, process.env.BANNER);
    print(bannerUrl);

    // uses fs and buffer to get the images and write a file .jpg
    await wait(page, 4000);
    const pfp = await page.goto(pfpUrl);
    const pfpBUffer = await pfp.buffer();
    await fs.promises.writeFile('./pfp.jpg', pfpBUffer);
    const banner = await page.goto(bannerUrl);
    const bannerBUffer = await banner.buffer();
    await fs.promises.writeFile('./banner.jpg', bannerBUffer);
    await browser.close();
    print('end.')
} main();