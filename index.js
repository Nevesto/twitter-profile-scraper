const pup = require('puppeteer');
const fs = require('fs');
require('dotenv').config();

async function main() {
    
    const browser = await pup.launch({headless:false});
    const page = await browser.newPage();
    console.log("Bot iniciado.");
    
    await page.goto(process.env.TRAVEL_URL);
    console.log("Indo para url.");
    
    async function login() {
        console.log("Aguardando seletor do input.");
        await page.waitForSelector(process.env.START_INPUT);
        console.log("input find.");
        
        await page.type(process.env.USER_INPUT, process.env.ACCOUNT_USER);
        await page.click(process.env.USER_BUTTON);
        console.log("Adicionando user.");
        
        await page.waitForSelector(process.env.PASSWORD_WAITFORSELECTOR);
        await page.type(process.env.PASSWORD_SELECTOR, process.env.ACCOUNT_PASSWORD);
        console.log("Adicionando senha.");
        
        await page.click(process.env.ENTER_BUTTON);
        console.log("Entrou na conta.");
        profileFinder();
    }; login();
    
    async function profileFinder() {
        console.log("Esperando seletor de busca.");
        await page.waitForSelector(process.env.WAIT_FOR_FIND_SELECTOR);
        
        console.log("Clicando no seletor de busca.");
        await page.click(process.env.FIND_BUTTON);
        
        console.log("Esperando seletor de input.");
        await page.waitForSelector(process.env.WAIT_PROFILE_INPUT);
        await page.type(process.env.TYPE_USER, process.env.TWITTER_PROFILE);
        console.log("Perfil encontrado.");
        
        await page.waitForTimeout(3000);
        await page.click(process.env.PROFILE_CLICK);
        console.log("entrando no perfil.");
        imagesDownload()
    };
    
    async function imagesDownload() {
        // Get the profile picture and banner
        
        await page.waitForTimeout(1500);
        
        const pfpURL = await page.$eval(process.env.PFP, img => img.getAttribute('src'));
        console.log(pfpURL);
        
        
        const bannerURL = await page.$eval(process.env.BANNER, img => img.getAttribute('src'));
        console.log(bannerURL);
        
        // download function
        
        await page.waitForTimeout(1500)
        
        const pfp = await page.goto(pfpURL);
        const pfpBUffer = await pfp.buffer();
        await fs.promises.writeFile('./pfp.jpg', pfpBUffer);
        
        
        const banner = await page.goto(bannerURL);
        const bannerBUffer = await banner.buffer();
        await fs.promises.writeFile('./banner.jpg', bannerBUffer);
        await browser.close();
        console.log("Scraper finalizado.");
    };
}main();