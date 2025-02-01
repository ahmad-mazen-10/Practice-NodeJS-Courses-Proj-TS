export const asyncWrapper = (asyncfn: Function) => {
  return (req: Request, res: Response, next: Function) => {
    asyncfn(req, res, next).catch((error: Error) => {
      next(error);
    });
  };
};
export default asyncWrapper;
