const User = require('../models/User');
const BuzzSpace = require('../models/BuzzSpace')

class UserController {
    static async createUser(username, password, email) {
        try {
            const newUser = new User({
                username: username,
                password: password,
                email: email
            });
            await newUser.save();
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    static async getUserByUsername(username) {
        try {
            const user = await User.findOne({ username: username });
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async verifyUser(id){
        try {
            const user = await User.findByIdAndUpdate(id, { is_verified: true }, { new: true });
            return user;
        } catch (error) {
            throw error; 
        }
    }
    

    static async updateUser(username, newUsername, newPassword) {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                throw new Error('User not found');
            }
            
            // Update username and password
            user.username = newUsername;
            user.password = newPassword;
            
            await user.save();
            
            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserController;
