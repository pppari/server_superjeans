const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET);
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        return null;
    }
}

const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
}

module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
    isTokenExpired,
};