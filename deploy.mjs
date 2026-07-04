import { execSync } from 'child_process';

console.log('Building for production (GitHub Pages)...');
execSync('DEPLOY=true npm run build', { stdio: 'inherit' });

console.log('Deploying to gh-pages branch...');
execSync('node -e "const ghpages = require(\'gh-pages\'); ghpages.publish(\'dist\', { dotfiles: true }, function(err) { if(err) { console.error(err); process.exit(1); } console.log(\'Deployed!\'); });"', { stdio: 'inherit' });

console.log('Done! Site will be live at: https://xmanispros.github.io/resumemaker-agent/');
