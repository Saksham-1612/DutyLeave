import JWT from "jsonwebtoken";

//Protected Routes token base
export const protect = async (req, res, next) => {
  try {
    const tokenHeader = req.headers.token;

    if (!tokenHeader) {
      return res.status(401).json({
        success: false,
        message: "Token not found in headers!",
      });
    }

    const tokenParts = tokenHeader.split(" ");
    // console.log(tokenParts[1]);

    if (tokenParts.length !== 2) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format!",
      });
    }

    const token = tokenParts[1];

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    // console.log(decode);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Token not found!",
    });
  }
};
