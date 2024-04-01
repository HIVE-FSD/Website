const BuzzSpace = require('../Models/BuzzSpace');

class BuzzSpaceController {
    static async createBuzzSpace(buzzSpaceName, buzzSpaceTag, description, coverImage, logoImage, creator) {
        try {
            const newBuzzSpace = new BuzzSpace({
                name: buzzSpaceName,
                tag: buzzSpaceTag,
                description: description,
                cover: coverImage,
                logo: logoImage,
                creator: creator
            });
            await newBuzzSpace.save();
            return newBuzzSpace;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BuzzSpaceController;
