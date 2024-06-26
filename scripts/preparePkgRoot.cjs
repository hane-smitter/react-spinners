/*  Note: In package.json scripts, according to how this script is called,
 this file will be run with `process.cwd` pointing to inside dist folder.
 So it is needful to run this script after `dist` directory has been created(`npm run build`)
 */

const fs = require("node:fs");
const path = require("node:path");
// console.log("process.cwd --> ", process.cwd());
const pkgJson = require("../package.json");

function run() {
	pkgJson.scripts = {};
	pkgJson.dependencies = {};
	pkgJson.devDependencies = {};
	pkgJson.sideEffects = false;
	pkgJson.files = ["*"]; // Since this script will run in dist directory, definitely we want all filles included in tarball

	const distPathRegex = /^\/?dist\//;
	if (distPathRegex.test(pkgJson.main)) {
		pkgJson.main = pkgJson.main.replace(distPathRegex, "");
		pkgJson.module = pkgJson.module.replace(distPathRegex, "");
		pkgJson.types = pkgJson.types.replace(distPathRegex, "");
	}

	const tarballPkgJsonPath = path.resolve(process.cwd(), "./package.json");
	// console.log({ tarballPkgJsonPath });
	fs.writeFileSync(
		tarballPkgJsonPath,
		Buffer.from(JSON.stringify(pkgJson, null, 2), "utf-8")
	);

	// Copy files  into package distribution directory
	fs.copyFileSync(
		path.resolve(process.cwd(), "../README.md"),
		path.resolve(process.cwd(), "./README.md")
	);
	fs.copyFileSync(
		path.resolve(process.cwd(), "../LICENSE"),
		path.resolve(process.cwd(), "./LICENSE")
	);
	fs.copyFileSync(
		path.resolve(process.cwd(), "../CHANGELOG.md"),
		path.resolve(process.cwd(), "./CHANGELOG.md")
	);
}

run();
