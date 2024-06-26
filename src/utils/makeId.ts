"use strict";

function check(it: any) {
	// Math is known to exist as a global in every environment.
	return it && it.Math === Math && it;
}

const globalObject =
	check(typeof window === "object" && window) ||
	check(typeof self === "object" && self) ||
	check(typeof global === "object" && global) ||
	// This returns undefined when running in strict mode
	(function () {
		// @ts-ignore: 'this' implicitly has type 'any' because it does not have a type annotation
		return this;
	})() ||
	Function("return this")();

function makeId(): string {
	let id: string = "";
	if (globalObject?.crypto?.randomUUID) {
		id = globalObject.crypto.randomUUID();
	} else if (globalObject?.btoa?.name) {
		id = globalObject.btoa(
			new Date(Math.ceil(Math.random() * 1e13)).getTime() + ""
		);
	} else {
		id = Date.now().toString(36) + Math.random().toString(36).substring(0);
	}
	return id;
}

export default makeId;
