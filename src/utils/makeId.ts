function makeId(): string {
	let id: string = "";
	if (self?.crypto?.randomUUID) {
		id = self.crypto.randomUUID();
	} else if (self?.btoa?.name) {
		id = self.btoa(new Date(Math.ceil(Math.random() * 1e13)).getTime() + "");
	} else {
		id = Date.now().toString(36) + Math.random().toString(36).substring(0);
	}
	return id;
}

export default makeId;
