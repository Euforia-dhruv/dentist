const { exec } = require('child_process');
const { chromium } = require('playwright');

const server = exec('npx next dev -p 3456', { cwd: '/home/dhruv/Documents/prototype/1/dental-hero' });

server.stdout.on('data', (data) => process.stdout.write(data));
server.stderr.on('data', (data) => process.stderr.write(data));

setTimeout(async () => {
  try {
    const browser = await chromium.launch({ 
      headless: true,
      args: ['--use-gl=angle', '--use-angle=swiftshader']
    });
    const errors = [];

    const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    desktopPage.on('pageerror', err => errors.push(err.message));
    await desktopPage.goto('http://localhost:3456', { waitUntil: 'networkidle', timeout: 30000 });
    await desktopPage.waitForTimeout(4000);
    await desktopPage.screenshot({ path: '/tmp/dental-final-hero.png', timeout: 30000 });
    console.log('Saved: desktop hero');

    await desktopPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 900));
    await desktopPage.waitForTimeout(500);
    await desktopPage.screenshot({ path: '/tmp/dental-final-footer.png', timeout: 30000 });
    console.log('Saved: desktop footer');
    await desktopPage.close();

    const mobilePage = await browser.newPage({ viewport: { deviceScaleFactor: 2, width: 390, height: 844, isMobile: true, hasTouch: true } });
    mobilePage.on('pageerror', err => errors.push(err.message));
    await mobilePage.goto('http://localhost:3456', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await mobilePage.waitForTimeout(8000);
    await mobilePage.screenshot({ path: '/tmp/dental-final-mobile.png', timeout: 30000 });
    console.log('Saved: mobile hero');
    await mobilePage.close();

    if (errors.length > 0) {
      console.log('Errors:');
      errors.forEach(e => console.log(' ', e.substring(0, 200)));
    } else {
      console.log('No errors');
    }

    await browser.close();
  } catch (e) {
    console.log('Test error:', e.message);
  }
  server.kill();
  process.exit(0);
}, 12000);
