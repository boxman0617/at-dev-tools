function AtHttpException(message, res) {
	this.message = message;
	this.stack = res;
}