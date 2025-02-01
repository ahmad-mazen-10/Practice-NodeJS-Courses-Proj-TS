export interface IRequest extends Request {
  query: {
    limit?: number;
    page?: number;
  };
}
