import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1320, height: 2400 } });
await p.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
await p.getByRole('button', { name: 'Ver dashboard →' }).click();
await p.waitForTimeout(400);
await p.screenshot({ path: 'C:/Users/Lenovo/AppData/Local/Temp/dashboard.png', fullPage: true });
await b.close();
console.log('dashboard shot ok');
