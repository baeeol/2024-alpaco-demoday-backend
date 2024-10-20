class ServiceException extends Error {
  reason: REASON_TYPE;

  constructor(reason: REASON_TYPE, msg: string) {
    super(msg);
    this.reason = reason;
  }
}

const REASON = {
  SERVER: "server",
  CLIENT: "client",
} as const;
type REASON_TYPE = (typeof REASON)[keyof typeof REASON];

export default ServiceException;
