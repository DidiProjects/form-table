const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '../example-app/package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

const publishedVersion = '^2.0.1';
const scriptBuildCss = "cpx2 src/index.css dist/index.css";

pkg.dependencies['@dspackages/form-table'] = publishedVersion;
pkg.scripts['build:css'] = scriptBuildCss;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log(`@dspackages/form-table set to ${publishedVersion} and build:css script set to "${scriptBuildCss}" in example-app/package.json`, pkg.dependencies);
