export class RedirectError extends PageError {
  url;

  constructor(code, url) {
    super();
    this.statusCode = code;
    this.url = url;
  }
}
