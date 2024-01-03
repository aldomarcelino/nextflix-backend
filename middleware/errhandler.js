const errorHandler = async (err, req, res, next) => {
  console.log(err);
  switch (err.name) {
    case "SequelizeValidationError":
      res
        .status(400)
        .json({ message: err.errors.map((e) => e.message), err: true });
      break;
    case "SequelizeUniqueConstraintError":
      res
        .status(400)
        .json({ message: err.errors.map((e) => e.message), err: true });
      break;
    case "JsonWebTokenError":
      res.status(401).json({ message: "Invalid Token", err: true });
      break;
    case "Not_Valid":
      res
        .status(401)
        .json({ message: "Invalid Username or Password", err: true });
      break;
    case "empthy":
      res
        .status(400)
        .json({ message: "Required Email or Password", err: true });
      break;
    case "Forbidden":
      res.status(403).json({ message: "Not Authorize", err: true });
      break;
    case "Not_Found":
      res.status(404).json({ message: "Data Not Found", err: true });
      break;
    default:
      res.status(500).json({ message: "Internal Server Error", err: true });
      break;
  }
};

module.exports = errorHandler;
