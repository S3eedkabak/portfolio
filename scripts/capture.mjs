import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const destination = 'docs/refinement/screenshots';
await mkdir(destination, { recursive:true });
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true });
try {
  for (const [device,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const page=await browser.newPage({viewport:{width,height}});
    await page.goto(process.env.PORTFOLIO_URL || 'http://127.0.0.1:4173');
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(1800);
    for (const suit of ['classic','symbiote']) {
      await page.locator(`[data-suit=${suit}]`).click();
      await page.waitForTimeout(700);
      for (const id of ['top','system','work','about','experience','contact']) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        await page.waitForTimeout(id === 'contact' ? 3200 : 850);
        await page.screenshot({path:`${destination}/${device}-${suit}-${id}.png`});
      }
      await page.locator('.project-scene').first().screenshot({path:`${destination}/${device}-${suit}-project.png`});
      await page.locator('.contact-console').screenshot({path:`${destination}/${device}-${suit}-keyboard.png`});
      const stage=page.locator('.bookshelf-stage-inner');
      await stage.scrollIntoViewIfNeeded(); await stage.focus(); await stage.press('Enter'); await page.waitForTimeout(700);
      await page.screenshot({path:`${destination}/${device}-${suit}-book-inspection.png`});
      await stage.press('Escape'); await page.waitForTimeout(500);
      await page.locator('#system h2').click();
      await page.locator('.shelf-installation').screenshot({path:`${destination}/${device}-${suit}-bookshelf.png`});
      for (const heading of await page.locator('main h2').all()) { await heading.scrollIntoViewIfNeeded(); await page.waitForTimeout(850); }
      await page.locator('#top').scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
      await page.screenshot({path:`${destination}/${device}-${suit}-full.png`,fullPage:true});
    }
    if (device === 'mobile') {
      for (const [lang,id] of [['AR','about'],['DE','system']]) {
        await page.locator('.mobile-language').selectOption(lang); await page.locator(`#${id}`).scrollIntoViewIfNeeded(); await page.waitForTimeout(900);
        await page.screenshot({path:`${destination}/mobile-${lang.toLowerCase()}.png`});
      }
      await page.locator('.mobile-language').selectOption('EN'); await page.getByRole('button',{name:'Toggle menu'}).click();
      await page.screenshot({path:`${destination}/mobile-navigation.png`});
    }
    await page.close();
  }
} finally { await browser.close(); }
console.log(`Screenshots saved in ${destination}`);
