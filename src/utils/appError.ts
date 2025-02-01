class AppError extends Error {
  statusCode: number;
  statusText: string;

  constructor(message: string, statusCode: number, statusText: string) {
    super(message);
    this.statusCode = statusCode;
    this.statusText = statusText;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

// class AppError extends Error{
//     constructor() {
//         super();
//     }
//     create(message, statusCode, statusText) {
//         this.message = message;
//         this.statusCode = statusCode;
//         this.statusText = statusText;
//         return this;
//     }
// }

// export default AppError;
