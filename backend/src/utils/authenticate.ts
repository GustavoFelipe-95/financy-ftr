import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const saltRounds = 10;
const AUTH_SECRET = process.env.JWT_SECRET as Secret;

export const generateAuthToken = (userID: string) => {
    return jwt.sign({ userID }, AUTH_SECRET, {expiresIn: '7d'});
};

export const verifyAuthToken = (token: string) => {
    try {
        return jwt.verify(token, AUTH_SECRET) as { userID: string };
    } catch (error) {
        return null;
    }
};

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
};