import { chromium } from 'playwright';

const pages = [
  { name: 'cockpit', path: '/' },
  { name: 'projects', path: '/projects' },
  { name: 'thinktank', path: '/thinktank' },
  { name: 'system', path: '/system' },
  { name: 'backoffice', path: '/backoffice' },
  { name: 'briefing', path: '/briefing' },
  { name: 'personal', path: '/personal' },
];

async function capture(port, prefix) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  // Go to root and skip boot
  await page.goto(`http://localhost:${port}/`);
  await page.waitForTimeout(1000);

  // Try to click boot button
  try {
    await page.click('text=VERIFY', { timeout: 2000 });
    await page.waitForTimeout(1500);
    // Try clicking LAUNCH if it appears
    try {
      await page.click('text=LAUNCH', { timeout: 2000 });
    } catch {}
    try {
      await page.click('text=Launch', { timeout: 2000 });
    } catch {}
    await page.waitForTimeout(3000);
  } catch {
    // Boot might already be done (sessionStorage)
  }

  // Set sessionStorage to skip boot on subsequent navigations
  await page.evaluate(() => sessionStorage.setItem('mckay-booted', '1'));

  for (const p of pages) {
    await page.goto(`http://localhost:${port}${p.path}`);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `/tmp/mc-compare/${prefix}-${p.name}.png`, fullPage: false });
    console.log(`  ${prefix}-${p.name}.png`);
  }

  await browser.close();
}

console.log('Capturing CORRECT version (dist, port 4173)...');
await capture(4173, 'correct');

console.log('Capturing NEW version (dev, port 5173)...');
await capture(5173, 'new');

console.log('Done! Compare images in /tmp/mc-compare/');
