const jwt = require("jsonwebtoken");

export const generateJWT = async (payload: object) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1m",
  });
  return token;
};
export default generateJWT;
