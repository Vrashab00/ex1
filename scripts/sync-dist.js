import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('client/dist');
const destDir = path.resolve('.');

if (fs.existsSync(srcDir)) {
  fs.copyFileSync(path.join(srcDir, 'index.html'), path.join(destDir, 'index.html'));
  
  const srcAssets = path.join(srcDir, 'assets');
  const destAssets = path.join(destDir, 'assets');
  if (fs.existsSync(srcAssets)) {
    fs.cpSync(srcAssets, destAssets, { recursive: true, force: true });
  }
  console.log('✅ Successfully synced client/dist to root for Live Server!');
}
