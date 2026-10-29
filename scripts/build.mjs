import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { cases } from '../src/cases.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sources = JSON.parse(fs.readFileSync(path.join(root, 'assets/sources.json'), 'utf8'));
const names = new Set(['jewelry-mobile']);
for (const project of cases) {
  names.add(project.cover);
  for (const screen of project.previewScreens || []) names.add(screen.name);
  for (const story of project.studies || [project]) {
    for (const screen of [...story.fullScreens, ...story.decisions.flatMap(item => item.images)]) names.add(screen.name);
  }
}
for (const name of names) {
  const source = sources.find(item => item.file === `assets/screens/${name}.png`);
  if (!source || !fs.existsSync(path.join(root, source.file))) throw new Error(`Missing image: ${name}`);
}
for(const name of names)if(!fs.existsSync(path.join(root,"assets/optimized/screens",name+".webp")))throw Error("Missing optimized image: "+name);
await build({ root });
fs.copyFileSync(path.join(root,"assets/fonts/Manrope-OFL.txt"),path.join(root,"dist/assets/Manrope-OFL.txt"));
fs.copyFileSync(path.join(root,'assets/fonts/CormorantGaramond-OFL.txt'),path.join(root,'dist/assets/CormorantGaramond-OFL.txt'));
fs.copyFileSync(path.join(root, 'assets/fonts/Inter-LICENSE.txt'), path.join(root, 'dist/assets/Inter-LICENSE.txt'));
for (const file of ['Phosphor-LICENSE.txt','Lucide-LICENSE.txt','Cult-UI-LICENSE.md']) fs.copyFileSync(path.join(root,'assets/logos',file),path.join(root,'dist/assets',file));
console.log(`Vue 3 production build complete. Verified ${names.size} local screen assets.`);
