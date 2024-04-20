const BuzzSpace = require('../models/BuzzSpace');
const User = require('../models/User')

const createBuzzSpace = async (buzzSpaceName, buzzSpaceTag, description, coverImage, logoImage, creator, rules) => {
    
    try {
        const newBuzzSpace = new BuzzSpace({
            name: buzzSpaceName,
            category: buzzSpaceTag,
            description: description,
            cover: coverImage,
            logo: logoImage,
            creator: creator,
            rules
        });
        const buzzSpaceId = await newBuzzSpace.save();
        const creator1 = await User.findById(creator);
        // console.log(creator1)
        creator1.joined_buzzSpace_ids.push(buzzSpaceId._id);
        newBuzzSpace._id.numberOfMembersJoined++;
        return newBuzzSpace;
    } catch (error) {
        throw error;
    }
}

const editBuzzSpace = async (req, res) => {
    const { userId, rules,  description, buzzSpaceId } = req.body;

    let buzzSpace;
    try {
        buzzSpace = await BuzzSpace.findById(buzzSpaceId)
        if(userId == buzzSpace.creator) await BuzzSpace.findByIdAndUpdate(buzzSpaceId, {
            rules,
            description
        })
        else return res.status(500).json({ message: "You cannot update the BuzzSpace" })
    } catch (err) {
        return console.log(err);
    }
    if (!buzzSpace) return res.status(500).json({ message: "Error updating BuzzSpace" })
    return res.status(200).json({ buzzSpace })
}

const joinBuzzSpace = async (req, res) => {
    const { buzzSpaceId, userId } = req.body;
    let existingUser;
    let existingBuzzSpace;
    try {
        existingUser = await User.findById(userId);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error finding user" });
    }
    try {
        existingBuzzSpace = await BuzzSpace.findById(buzzSpaceId);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error finding BuzzSpace" });
    }
    if (!existingUser) return res.status(404).json({ message: "User doesn't exist" })
    if (!existingBuzzSpace) return res.status(404).json({ message: "BuzSpace doesn't exist" })
    if (existingUser.joined_buzzSpace_ids.includes(buzzSpaceId))
        return res.status(201).json({ message: "You already joined the BuzzSpace!!" })

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
        if (buzzSpaceCreator.notifications) {
            buzzSpaceCreator.notifications.push(notification);

            await buzzSpaceCreator.save(); 
        } else {
            console.log("BuzzSpace creator's notifications array does not exist.");
        }

    } catch (err) {
        console.log(err);
    }

    try {
        await existingUser.save();
        await existingBuzzSpace.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error saving user or buzz space" });
    }

    res.status(200).json({ message: "Successfully joined the BuzzSpace!" });
}

const leaveBuzzSpace = async(req, res) => {
    const {buzzSpaceId, userId} = req.body;

    let existingUser;
    let existingBuzzSpace;

    try{
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
        if(!existingUser.joined_buzzSpace_ids.includes(buzzSpaceId)){
             return res.status(404).json({message: "You did not join the Buzzspace"})
        }
        existingUser.joined_buzzSpace_ids = existingUser.joined_buzzSpace_ids.filter(id => id != buzzSpaceId);
        
        await existingUser.save();
            
        res.status(200).json({ message: "Successfully left the BuzzSpace!" });
    
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Error leaving BuzzSpace" });
    }
}

const requestPromotion = async (req, res) => {
    const { userId, buzzSpaceId } = req.body;

    try {
        let buzzSpace1 = await BuzzSpace.findById(buzzSpaceId);
        if (!buzzSpace1) return res.status(500).json({ message: "Cannot find buzzSpace" });
        const user = await User.findById(userId);
        let creator1 = buzzSpace1.creator;
        let creator2 = await User.findById(creator1)
        if (!creator1) return res.status(500).json({ message: "Cannot find creator" });

        const notificationMessage = `${creator2.username} has requested promotion in BuzzSpace ${buzzSpace1.name}`;

        const notification = {
            type: 'request',
            message: notificationMessage,
            request: {
                user: { ...user.info, username:user.username },
                buzzspace: buzzSpace1.name,
            }
        };
        creator2.notifications.push(notification);

        await creator2.save();
        
        return res.status(201).json({ message: "Request Sent!!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error processing request" });
    }
}

const approve = async(req, res) => {
    const {userId, buzzSpaceId} = req.body;

    try{
        const buzzSpace = await BuzzSpace.findById(buzzSpaceId);
        buzzSpace.moderators.push(userId);
        return res.status(201).json({ message: "Moderator Added" });
    }catch(err){
        console.log(err);
    }
}

const clearNotification = async(req, res) => {
    const { UserId, notificationIndex } = req.body;
    try{
        const user = await User.findById(UserId);
        user.notifications.splice(notificationIndex, 1);
        return res.status(201).json({message: "Notofication deleted"});
    }catch(err){
        console.log(err);
    }
}

module.exports = { createBuzzSpace, editBuzzSpace, joinBuzzSpace, leaveBuzzSpace, requestPromotion, approve, clearNotification};
