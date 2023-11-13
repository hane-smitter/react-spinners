function makeId(): string {
	if (self?.crypto?.randomUUID) {
		const uid = self.crypto.randomUUID();
		return uid;
	} else if (self?.btoa?.name) {
		const unique = self.btoa(
			new Date(Math.ceil(Math.random() * 1e13)).getTime() + ""
		);

		return unique;
	} else {
		const uid =
			Date.now().toString(36) + Math.random().toString(36).substring(0);
		return uid;
	}
}

export default makeId;
