import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../..');
const publicDir = path.resolve(__dirname, '../public');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Only sync if root assets exist (e.g. In repo clone)
if (fs.existsSync(path.join(rootDir, 'library.json')) || fs.existsSync(path.join(rootDir, 'library'))) {
  console.log('🔄 Syncing root assets (library, posts, images, manifests) to web/public...');

  // Manifests
  if (fs.existsSync(path.join(rootDir, 'library.json'))) {
    fs.copyFileSync(path.join(rootDir, 'library.json'), path.join(publicDir, 'library.json'));
  }
  if (fs.existsSync(path.join(rootDir, 'posts.json'))) {
    fs.copyFileSync(path.join(rootDir, 'posts.json'), path.join(publicDir, 'posts.json'));
  }

  // Folders
  copyDirRecursive(path.join(rootDir, 'library'), path.join(publicDir, 'library'));
  copyDirRecursive(path.join(rootDir, 'posts'), path.join(publicDir, 'posts'));
  copyDirRecursive(path.join(rootDir, 'images'), path.join(publicDir, 'images'));

  console.log('✅ Assets successfully synced to web/public.');
} else {
  console.log('ℹ️ Root directory not found or already in isolated build, skipping asset sync.');
}
