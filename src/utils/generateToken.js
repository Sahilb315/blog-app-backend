import jwt from "jsonwebtoken";

export async function generateJwtToken(tokenData, secretKey, jwt_expire) {
  return jwt.sign(tokenData, secretKey, { expiresIn: jwt_expire});
}