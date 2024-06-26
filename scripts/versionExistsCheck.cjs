const { exec } = require("child_process");
const packageJson = require("../package.json");
const chalk = require("chalk");

// const command = "[ \"$(npm view .@${npm_package_version})\" == \"\" ] && exit 0";
const command = `npm view ${packageJson.name}@${packageJson.version} --json`;

exec(command, (_error, stdout, stderr) => {
	const jsonErrStr = stdout; // expected to be a JSON string due to --json passed to command
	const { error: err } = JSON.parse(jsonErrStr) || {};

	// console.log({ error: !!error, stdout: !!stdout, stderr: !!stderr });

	if (stderr && err && err.code === "E404") {
		// When no package version is found, then it okay to publish this version
		process.exitCode = 0;
		console.log(chalk.greenBright("This is a NEW Version number!"));
	} else if (stderr) {
		// To identify an stdout error that occured whose code was not 'E404'
		process.exitCode = 2;
		console.log(chalk.bgRed("stderr:") + " " + stderr);
	} else {
		// if command resolves sucessfully, definitely a vesrion of this package already exists
		process.exitCode = 1;
		console.log(chalk.red("Package Version already exists!"));
	}

	process.exit();
});
