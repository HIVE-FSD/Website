const BuzzSpace = require('../models/BuzzSpace');

const createBuzzSpace = async (buzzSpaceName, buzzSpaceTag, description, coverImage, logoImage, creator) => {
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

const editBuzzSpace = async (req, res) => {
    const { cover, logo, description } = req.body;
    const buzzSpaceId = req.params.buzzSpaceId;

    try {
        BuzzSpace1 = await BuzzSpace.findByIdAndUpdate(buzzSpaceId, {
            cover,
            logo,
            description
        })
    } catch (err) {
        return console.log(err);
    }
    if (!BuzzSpace1) return res.status(500).json({ message: "Error updating BuzzSpace" })
    return res.status(200).json({ buzzSpace1 })
}

module.exports = { createBuzzSpace, editBuzzSpace };
