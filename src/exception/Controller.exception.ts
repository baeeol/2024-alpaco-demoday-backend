class ControllerException extends Error {
  httpCode: number;

  constructor(httpCode: number, msg: string) {
    super(msg);
    this.httpCode = httpCode;
  }
}

export default ControllerException;
