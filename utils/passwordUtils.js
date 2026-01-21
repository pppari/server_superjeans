const argon2 = require('argon2');

const hashPassword = async (password) => {
    try {
        const hashedPassword = await argon2.hash(password);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

const verifyPassword = async (password, hashedPassword) => {
        try {
            const isMatch = await argon2.verify(hashedPassword, password);
            return isMatch;
        } catch (error) {
            console.error('Error verifying password:', error);
            throw error;
        }
    }


    module.exports = {
        hashPassword,
        verifyPassword
    };