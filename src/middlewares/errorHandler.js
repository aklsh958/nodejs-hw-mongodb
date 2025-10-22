export const errorHandler = (err, req, res, next) => {
  console.error('--- ERROR START ---');
  console.error(err); 
  console.error('--- ERROR END ---');

  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    status,
    message,
    data: err.message,
  });
};
