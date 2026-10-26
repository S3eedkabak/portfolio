import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const theme = (page, suit) => page.locator(`[data-suit="${suit}"]`);
async function chooseLanguage(page, language) {
  if (page.viewportSize().width <= 800) await page.locator('.mobile-language').selectOption(language);
  else await page.locator('.language-picker').getByRole('button', { name: language, exact: true }).click();
}
async function noOverflow(page) {
  await expect.poll(async () => page.evaluate(() => ({
    width: innerWidth, scroll: document.documentElement.scrollWidth,
    overflow: [...document.querySelectorAll('h1,h2,h3,p,.site-nav,.contact-console,.componentry-keyboard-shell,.project-tags')].filter(el => {
      const r = el.getBoundingClientRect();
      if (el.classList.contains('email-accessible')) return false;
      return r.width > 0 && (r.left < -2 || r.right > innerWidth + 2 || el.scrollWidth > el.clientWidth + 2);
    }).map(el => ({ tag: el.tagName, class: el.className, text: el.textContent.slice(0, 60) })),
  })).then(result => result.scroll > result.width + 1 ? [{ rootOverflow: result }] : result.overflow), { intervals: [50,100,200] }).toEqual([]);
}

test('protected content, original artwork, font and inactive modules are unchanged', () => {
  for (const path of ['src/data/portfolio.js','src/data/i18n.js','src/data/syrianArabic.js','src/assets/spider.svg','public/fonts/LastoriaBoldRegular.otf','src/components/GameSection.jsx','src/MacBookScene.jsx','src/components/ui/mac-keyboard.tsx']) {
    expect(readFileSync(path).equals(execFileSync('git', ['show', `HEAD:${path}`])), path).toBe(true);
  }
});

test('system preference, bidirectional suit change, persistence and language isolation', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'symbiote');
  await theme(page,'classic').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'classic');
  await expect(theme(page,'classic')).toBeEnabled();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','classic');
  await page.emulateMedia({ colorScheme:'light' });
  await theme(page,'symbiote').click();
  await expect(theme(page,'symbiote')).toBeEnabled();
  for (const lang of ['DE','SK','AR','EN']) {
    await chooseLanguage(page,lang);
    await expect(page.locator('.site')).toHaveAttribute('lang',lang.toLowerCase());
    await expect(page.locator('html')).toHaveAttribute('data-theme','symbiote');
  }
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','symbiote');
});

test('unselected suit follows live OS preference; blocked storage stays usable', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error('blocked'); }; Storage.prototype.getItem = () => { throw new Error('blocked'); }; });
  await page.emulateMedia({ colorScheme:'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme','classic');
  await page.emulateMedia({ colorScheme:'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme','symbiote');
  await theme(page,'classic').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','classic');
});

for (const width of [320,360,375,390,430,768,1024,1440,1920]) {
  test(`all four languages and both themes fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion:'reduce' });
    const errors=[]; page.on('pageerror',err => errors.push(err.message));
    await page.goto('/');
    for (const suit of ['classic','symbiote']) {
      await theme(page,suit).click();
      for (const lang of ['EN','DE','SK','AR']) {
        await chooseLanguage(page,lang);
        await expect(page.locator('.site')).toHaveAttribute('dir',lang === 'AR' ? 'rtl' : 'ltr');
        await expect(page.locator('html')).toHaveAttribute('data-theme',suit);
        if (lang === 'AR') await expect(page.locator('.hero-bio')).toContainText('ببني برمجيات مفيدة');
        await noOverflow(page);
      }
    }
    expect(errors).toEqual([]);
  });
}

test('desktop destinations, original project URLs, signature and source canvas render', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-signature g path')).toHaveCount(11);
  await expect(page.locator('.hero-signature g path').first()).toHaveAttribute('fill','var(--color-hero-foreground)');
  expect(await page.locator('.hero-signature').evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(80);
  await expect(page.locator('.hero-ascii canvas')).toBeVisible();
  await expect(page.locator('.ascii-source-fallback')).toHaveCount(0);
  const hrefs=await page.locator('.project-row').evaluateAll(elements=>elements.map(el=>el.href));
  expect(hrefs).toEqual(['https://github.com/S3eedkabak/GreenPoint-TreeD','https://github.com/DominykasPivo/MARP-Guide-RAG-Chatbot','https://github.com/S3eedkabak/BACity']);
  for (const [name,id] of [['System','system'],['Work','work'],['About','about']]) {
    await page.locator('.motion-dock').getByRole('button',{name,exact:true}).click();
    await expect.poll(async()=>page.locator(`#${id}`).evaluate(el=>Math.abs(el.getBoundingClientRect().top))).toBeLessThan(250);
    await expect(page.locator('.motion-dock').getByRole('button',{name,exact:true})).toHaveAttribute('aria-current','location');
  }
  await page.getByRole('button',{name:'Back to top'}).click();
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeLessThan(10);
  await expect(page.locator('.motion-dock a')).toHaveAttribute('href','https://www.linkedin.com/in/saeid-kabak-5311a3309');
});

test('mobile menu, selection close, Escape and mobile mail behavior', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  const toggle=page.getByRole('button',{name:'Toggle menu'});
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  await page.locator('#mobile-navigation').getByRole('button',{name:'Work',exact:true}).click();
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await toggle.click(); await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(page.locator('.contact-mail')).toHaveAttribute('href','mailto:saeedkabak@gmail.com');
  await page.locator('.mobile-language').selectOption('AR');
  await toggle.click();
  await expect(page.locator('#mobile-navigation')).toContainText('شغلي');
  await page.locator('#mobile-navigation').getByRole('button',{name:'شغلي',exact:true}).click();
  await expect(toggle).toHaveAttribute('aria-expanded','false');
});

test('bookshelf keyboard inspection, pointer orbit, selection survives theme and locale', async ({ page }) => {
  await page.goto('/');
  const stage=page.locator('.bookshelf-stage-inner');
  await stage.scrollIntoViewIfNeeded(); await stage.focus();
  await stage.press('Enter');
  await expect(stage).toHaveAttribute('aria-label',/Focused/);
  const original=await stage.getAttribute('aria-label');
  // Pointer drag rotates the selected book without closing it.
  const bounds=await stage.boundingBox();
  await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);
  await page.mouse.down(); await page.mouse.move(bounds.x+bounds.width/2+65,bounds.y+bounds.height/2+30,{steps:8}); await page.mouse.up();
  await expect(stage).toHaveAttribute('aria-label',original);
  await theme(page,'symbiote').click(); await expect(theme(page,'symbiote')).toBeEnabled();
  await expect(stage).toHaveAttribute('aria-label',original);
  await chooseLanguage(page,'DE');
  await expect(stage).toHaveAttribute('aria-label',/Focused/);
  await stage.focus(); await stage.press('ArrowRight');
  await expect.poll(()=>stage.getAttribute('aria-label')).not.toBe(original);
  await stage.press('Escape');
  await expect(stage).not.toHaveAttribute('aria-label',/Focused/);
  await stage.press('Space');
  await expect(stage).toHaveAttribute('aria-label',/Focused/);
});

test('contact activation, mapped keys, replay and theme/language do not restart typing', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.typed-email')).toHaveText('');
  await expect(page.locator('.contact-mail')).toHaveAttribute('href',/https:\/\/mail.google.com\/mail\/\?view=cm&fs=1&to=saeedkabak%40gmail.com/);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('.typed-email')).toHaveText('saeedkabak@gmail.com');
  await theme(page,'symbiote').click();
  await expect(page.locator('.typed-email')).toHaveText('saeedkabak@gmail.com');
  await chooseLanguage(page,'AR');
  await expect(page.locator('.typed-email')).toHaveText('saeedkabak@gmail.com');
  await chooseLanguage(page,'EN');
  await page.getByRole('button',{name:'Type it again',exact:true}).click();
  await expect.poll(()=>page.locator('.typed-email').textContent(), { intervals: [20,30,50] }).toBe('s');
  await expect(page.locator('.componentry-key-active .componentry-key-letter')).toHaveText('S');
  await expect(page.locator('.typed-email')).toHaveText('saeedkabak@gmail.com');
  await page.keyboard.down('a');
  await expect(page.locator('.componentry-key-active').filter({hasText:/^A$/})).toBeVisible();
  await page.keyboard.up('a');
});

test('reduced motion renders final readable states and every feature remains reachable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion:'reduce' }); await page.goto('/');
  await expect(page.locator('.typed-email')).toHaveText('saeedkabak@gmail.com');
  await expect(page.locator('.hero-signature > path').first()).toHaveCSS('opacity','1');
  for (const id of ['system','work','about','experience','contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id} h2`)).toBeVisible();
  }
  await theme(page,'symbiote').click();
  await expect(theme(page,'symbiote')).toBeEnabled();
});


test('both suits pass automated WCAG A/AA accessibility checks', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  for (const suit of ['classic','symbiote']) {
    await theme(page,suit).click();
    for (const id of ['system','work','about','experience','contact']) await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    const results = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))).toEqual([]);
  }
});


test('fallback suit transition works without View Transition support', async ({ page }) => {
  await page.addInitScript(() => { document.startViewTransition = undefined; });
  await page.goto('/');
  await theme(page,'symbiote').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','symbiote');
  await theme(page,'classic').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','classic');
});

test('ASCII samples are cached, pauses offscreen and reacts to reduced-motion changes', async ({ page }) => {
  await page.addInitScript(() => {
    window.canvasMetrics = { text:0, sample:0 };
    const text = CanvasRenderingContext2D.prototype.fillText;
    const sample = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.fillText = function(...args) { if(this.canvas.classList.contains('ascii-effect-canvas')) window.canvasMetrics.text++; return text.apply(this,args); };
    CanvasRenderingContext2D.prototype.drawImage = function(...args) { if(args[0] instanceof HTMLImageElement && args[0].src.includes('spider')) window.canvasMetrics.sample++; return sample.apply(this,args); };
  });
  await page.goto('/');
  await expect.poll(()=>page.evaluate(()=>window.canvasMetrics.text)).toBeGreaterThan(100);
  await page.waitForTimeout(300);
  const first = await page.evaluate(()=>({...window.canvasMetrics}));
  await page.waitForTimeout(300);
  const second = await page.evaluate(()=>({...window.canvasMetrics}));
  expect(second.sample).toBe(first.sample);
  expect(second.text).toBeGreaterThan(first.text);
  await page.locator('#contact').scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
  const offscreen = await page.evaluate(()=>window.canvasMetrics.text);
  await page.waitForTimeout(300);
  expect(await page.evaluate(()=>window.canvasMetrics.text)).toBe(offscreen);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('#top').scrollIntoViewIfNeeded(); await page.waitForTimeout(200);
  const staticFrame = await page.evaluate(()=>window.canvasMetrics.text);
  await page.waitForTimeout(300);
  expect(await page.evaluate(()=>window.canvasMetrics.text)).toBe(staticFrame);
});

test('touch bookshelf selection and mobile keyboard routing remain usable', async ({ browser }) => {
  const context = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage(); await page.goto('/');
  const stage = page.locator('.bookshelf-stage-inner');
  await stage.scrollIntoViewIfNeeded();
  const canvas=stage.locator('canvas'); await expect(canvas).toBeVisible();
  await page.waitForTimeout(700);
  const box=await canvas.boundingBox();
  await page.touchscreen.tap(box.x+box.width/2, box.y+box.height/2);
  await expect(stage).toHaveAttribute('aria-label',/Focused/);
  await expect(page.locator('.contact-mail')).toHaveAttribute('href','mailto:saeedkabak@gmail.com');
  await context.close();
});
