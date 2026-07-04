import { execSync } from 'child_process';

console.log('Building for production (GitHub Pages)...');
execSync('npm run build', { stdio: 'inherit', env: { ...process.env, DEPLOY: 'true' } });

console.log('Deploying to gh-pages branch...');
const deployScript = `
const ghpages = require('gh-pages');
ghpages.publish('dist', { dotfiles: true }, function(err) {
  if(err) { console.error(err); process.exit(1); }
  console.log('Deployed successfully!');
});
`;
execSync(`node -e "${deployScript.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });

console.log('Done! Site will be live at: https://xmanispros.github.io/resumemaker-agent/');
