export function errorHandler(err, req, res, _next) {
  console.error(err);
  const status = err.status ?? 500;
  res.status(status).json({
    error: err.message ?? "Internal server error",
    ...(process.env.NODE_ENV !== "production" && err.stack ? { stack: err.stack } : {}),
  });
}

export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
}
