const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '../example-app/package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

const publishedVersion = '^2.0.1';

pkg.dependencies['@dspackages/form-table'] = publishedVersion;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log(`@dspackages/form-table set to ${publishedVersion} in example-app/package.json`);
