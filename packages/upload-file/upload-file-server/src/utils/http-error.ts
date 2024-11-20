enum HttpStatus {
  SUCCESS = 200
}

export class HttpError extends Error {
  constructor(public code: HttpStatus, public message: string) {
    super(message);
  }
}