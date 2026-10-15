/* Rendu de la vidéo 9:16 image par image.
 * Usage : node render.cjs <dossier-images> [fps]            -> une image PNG par frame
 *         node render.cjs <dossier-images> --stills 1.2,5.3  -> captures à ces instants
 * Puis encoder avec encode.sh.
 */
const path = require("path");
const fs = require("fs");
let pw;
try { pw = require("playwright"); } catch { pw = require("/opt/node22/lib/node_modules/playwright"); }

(async () => {
  const out = process.argv[2];
  if (!out) { console.error("usage: node render.cjs <dossier> [fps | --stills t1,t2]"); process.exit(1); }
  fs.mkdirSync(out, { recursive: true });
  const stills = process.argv[3] === "--stills" ? process.argv[4].split(",").map(Number) : null;
  const fps = stills ? 0 : Number(process.argv[3] || 60);

  const browser = await pw.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto("file://" + path.join(__dirname, "index.html") + "?render");
  await page.evaluate(() => window.__ready);
  const stage = await page.$("#stage");

  const times = stills || Array.from({ length: Math.round(15 * fps) }, (_, i) => i / fps);
  for (let i = 0; i < times.length; i++) {
    await page.evaluate((t) => window.render(t), times[i]);
    const name = stills ? `still-${times[i].toFixed(2)}.png` : `f${String(i).padStart(5, "0")}.png`;
    await stage.screenshot({ path: path.join(out, name) });
    if (!stills && i % 60 === 0) console.log(`${i}/${times.length}`);
  }
  await browser.close();
})();
