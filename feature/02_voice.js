
const DEFAULT_TXT = 'Topdanmark !!! KL~~! Morning, Ser Lah MAT parr gee , Lahh  ! , nama saya Puppeteer. I am controlling your browser.. ';

const executablePath = process.env.CHROME_PATH ;

const puppeteer = require('puppeteer');
const fs = require('fs');

(async() => {

const browser = await puppeteer.launch({
  executablePath,  // Note: need Chrome (not Chromium) to use non-default voices.
  headless: false, // Speech synth API doesn't work in headless. crbug.com/815388
  args: [
    '--window-size=0,0', // Launch baby window for fun.
    '--window-position=0,0',
    '--enable-speech-dispatcher', // Needed for Linux?
  ],
});

const page = await browser.newPage();

// Clever way to "communicate with page". Know when speech is done.
page.on('console', async msg => {
  if (msg.text() === 'SPEECH_DONE') {
    await browser.close();
  }
});


const html = fs.readFileSync('./02_voice_speech.html', {encoding: 'utf-8'});
const flagIdx = process.argv.findIndex(item => item === '-t');
const text = flagIdx === -1 ? DEFAULT_TXT : process.argv.slice(flagIdx + 1).join(' ');

await page.evaluateOnNewDocument(text => window.TEXT2SPEECH = text, text);
 
// Cause a navigation so the evaluateOnNewDocument kicks in.
await page.goto(`data:text/html,${html}`);

 const button = await page.$('button');
button.click();

})();