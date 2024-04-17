const BuzzSpace = require('../models/BuzzSpace');
const User = require('../models/User')

const createBuzzSpace = async (buzzSpaceName, buzzSpaceTag, description, coverImage, logoImage, creator) => {
    try {
        const newBuzzSpace = new BuzzSpace({
            name: buzzSpaceName,
            category: buzzSpaceTag,
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

const joinBuzzSpace = async (req, res) => {
    const { buzzSpaceId, userId } =  req.body;
    let existingUser;
    let existingBuzzSpace;
    try{
        existingUser = await User.findById(userId);
        
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Error finding user" });
    }
    try{
        existingBuzzSpace = await BuzzSpace.findById(buzzSpaceId);
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Error finding BuzzSpace" });
    }
    if(!existingUser) return res.status(404).json({message: "User doesn't exist"})
    if(!existingBuzzSpace) return res.status(404).json({message: "BuzSpace doesn't exist"})
    if(existingUser.joined_buzzSpace_ids.includes(buzzSpaceId))
        return res.status(201).json({message: "You already joined the BuzzSpace!!"})

    existingUser.joined_buzzSpace_ids.push(buzzSpaceId);
    existingBuzzSpace.numberOfMembersJoined++;
    
    let buzzSpaceCreator;
try {
    buzzSpaceCreator = await User.findById(existingBuzzSpace.creator);
        const notificationMessage = `${existingUser.username} joined your BuzzSpace "${existingBuzzSpace.name}"`;
        const notification = {
            type: 'buzzspace',
            message: notificationMessage
        };
        if (buzzSpaceCreator.notifications) { // Ensure notifications array exists
           console.log('hello');
            buzzSpaceCreator.notifications.push(notification);
            await buzzSpaceCreator.save(); // Save changes to buzzSpaceCreator
        } else {
            console.log("BuzzSpace creator's notifications array does not exist.");
        }
    
} catch (err) {
    console.log(err);
}

    try{
        await existingUser.save();
        await existingBuzzSpace.save();
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Error saving user or buzz space" });
    }

    res.status(200).json({ message: "Successfully joined the BuzzSpace!" });
}

module.exports = { createBuzzSpace, editBuzzSpace, joinBuzzSpace };
