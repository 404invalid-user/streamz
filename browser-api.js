const config = require('./config');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
let browser;
let page;

module.exports.start = async() => {
    puppeteer.use(StealthPlugin());
    puppeteer.use(AdblockerPlugin());
    browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null, //Defaults to an 800x600 viewport
        args: [
            '--start-fullscreen', // you can also use '--start-maximized'
            '--app=https://www.google.com/'
        ]
    });
    const pages = await browser.pages()
    page = pages[0];
    return;
}


module.exports.youtubeFullScreen = async() => {
    const url = this.getUrl(page.url());
    if (url.domain == 'youtube.com' && url.path[0].split('?')[0].toLowerCase() == 'watch') {
        await page.click('.ytp-fullscreen-button.ytp-button');
    }
    return;
}

module.exports.youtubeCinemaModeToggle = async() => {
    const url = this.getUrl(page.url());
    if (url.domain !== 'youtube.com' || url.path[0].split('?')[0].toLowerCase() !== 'watch') throw "Error: must be youtube watch url";
    await page.click('.ytp-size-button.ytp-button');
    return;

}
module.exports.youtubeCinemaMode = async() => {
    const url = this.getUrl(page.url());
    if (url.domain !== 'youtube.com' || url.path[0].split('?')[0].toLowerCase() !== 'watch') throw "Error: must be youtube watch url";
    const cmbtn = await page.evaluate('document.querySelector(".ytp-size-button.ytp-button").getAttribute("aria-label")');
    if (cmbtn == "Cinema mode (t)") {
        await page.click('.ytp-size-button.ytp-button');
    }

    return;

}
module.exports.youtubeCinemaModeExit = async() => {
    const url = this.getUrl(page.url());
    if (url.domain !== 'youtube.com' || url.path[0].split('?')[0].toLowerCase() !== 'watch') throw "Error: must be youtube watch url";
    const cmbtn = await page.evaluate('document.querySelector(".ytp-size-button.ytp-button").getAttribute("aria-label")');
    if (cmbtn !== "Cinema mode (t)") {
        await page.click('.ytp-size-button.ytp-button');
    }
    return;
}


module.exports.togglePlayPause = async() => {
    // ytp-play-button ytp-button
    const url = this.getUrl(page.url());
    if (url.domain == 'youtube.com' && url.path[0].split('?')[0].toLowerCase() == 'watch') {
        const ppbtn = await page.evaluate('document.querySelector(".ytp-play-button.ytp-button").getAttribute("title")');
        await page.click('.ytp-play-button.ytp-button');

        if (ppbtn == 'Pause (k)') {
            return {
                state: 'paused',
                type: 'youtube'
            }
        } else if (ppbtn == 'Play (k)') {
            return {
                state: 'playing',
                type: 'youtube'
            }
        }
    }
    return {
        state: 'null',
        type: 'null'
    }

}

module.exports.getUrl = (url) => {
    //get url info
    let link = url.replace('https://', '').replace('http://', '').split('/');
    let fullDomain = link[0];
    let domain = link[0].split('.')[link[0].split('.').length - 2] + '.' + link[0].split('.')[link[0].split('.').length - 1];
    let topLevelDomain = link[0].split('.')[link[0].split('.').length - 1];
    let path = link.slice(1)

    return {
        fullDomain,
        domain,
        topLevelDomain,
        path
    }
}

module.exports.open = async(link, cookies) => {
    //get url info
    const url = this.getUrl(link);
    try {
        await page.goto(link);
    } catch (err) {
        console.log(err);
        return;
    }
    if (cookies) {
        await page.setCookie(...cookies);
    }
    //check if youtube watch url
    if (url.domain == 'youtube.com' && url.path[0].split('?')[0].toLowerCase() == 'watch') {
        if (config.youtube.autoCinemaMode) {
            this.youtubeFullScreen();
        }
        if (config.youtube.autoFullscreen) {
            this.youtubeFullScreen()
        }
    }
    return;
}
module.exports.googleLogin = async() => {
    await page.goto("https://accounts.google.com/ServiceLogin?hl=en&continue=https://www.youtube.com/?cbrd%3D1&gae=cb-eomty");
    await page.type('[type="email"', process.env.GOOGLE_email);
    await page.click('#identifierNext');
    await page.waitForTimeout(1500);
    await page.type('[type="password"', process.env.GOOGLE_password);
    await page.click('#passwordNext');
    await page.waitForTimeout(1500);
    return;
}

module.exports.close = () => {
    browser.close();
    return;
}
