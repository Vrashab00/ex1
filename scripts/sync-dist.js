import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('client/dist');
const destDir = path.resolve('.');
const distDir = path.resolve('dist');

if (fs.existsSync(srcDir)) {
  // Sync to root for local Live Server
  fs.copyFileSync(path.join(srcDir, 'index.html'), path.join(destDir, 'index.html'));
  
  const srcAssets = path.join(srcDir, 'assets');
  const destAssets = path.join(destDir, 'assets');
  if (fs.existsSync(srcAssets)) {
    fs.cpSync(srcAssets, destAssets, { recursive: true, force: true });
  }

  // Also sync to dist/ for standard hosting providers
  fs.cpSync(srcDir, distDir, { recursive: true, force: true });

  console.log('✅ Successfully synced client/dist to root and dist/ for Vercel & Live Server!');
}

