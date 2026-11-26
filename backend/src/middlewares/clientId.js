const requireClientId = (req, res, next) => {
  const clientId = req.headers["x-client-id"];

  if (!clientId || !/^[a-zA-Z0-9-]{8,64}$/.test(clientId)) {
    return res.status(400).json({ message: "Missing or invalid client id" });
  }

  req.clientId = clientId;
  next();
};

module.exports = { requireClientId };
