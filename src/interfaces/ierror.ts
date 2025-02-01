export interface CustomError extends Error {
  statusCode?: number;
  statusText?: string;
}