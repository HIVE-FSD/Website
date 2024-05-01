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
        const buzzSpace = await newBuzzSpace.save();

        return buzzSpace;

    } catch (error) {
        throw error;
    }
}

const editBuzzSpace = async (req, res) => {
    const { userId, rules, description, buzzSpaceId } = req.body;

    let buzzSpace;
    try {
        buzzSpace = await BuzzSpace.findById(buzzSpaceId)
        if (userId == buzzSpace.creator) await BuzzSpace.findByIdAndUpdate(buzzSpaceId, {
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
        if (existingBuzzSpace.numberOfMembersJoined % 100 == 0) {
            buzzSpaceCreator = await User.findById(existingBuzzSpace.creator);
            const notificationMessage = `Number of users in ${existingBuzzSpace.name} reached ${existingBuzzSpace.numberOfMembersJoined}`;
            const notification = {
                type: 'buzzspace',
                message: notificationMessage
            };
            if (buzzSpaceCreator.notifications) {
                buzzSpaceCreator.notifications.unshift(notification);

                await buzzSpaceCreator.save();
            } else {
                console.log("BuzzSpace creator's notifications array does not exist.");
            }
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

const leaveBuzzSpace = async (req, res) => {
    const { buzzSpaceId, userId } = req.body;

    let existingUser;
    let existingBuzzSpace;

    try {
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
        if (!existingUser.joined_buzzSpace_ids.includes(buzzSpaceId)) {
            return res.status(404).json({ message: "You did not join the Buzzspace" })
        }

        if (existingBuzzSpace.moderators.includes(existingUser._id)) {
            existingBuzzSpace.moderators = existingBuzzSpace.moderators.filter(modId => {
                console.log('Comparing:', modId.toString(), existingUser._id.toString());
                return modId.toString() !== existingUser._id.toString();
            });
        }

        existingUser.joined_buzzSpace_ids = existingUser.joined_buzzSpace_ids.filter(id => id != buzzSpaceId);
        existingBuzzSpace.numberOfMembersJoined--;
        await existingUser.save();
        await existingBuzzSpace.save()

        res.status(200).json({ message: "Successfully left the BuzzSpace!" });

    } catch (err) {
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
                user: { ...user.info, username: user.username },
                buzzspace: buzzSpace1.name,
            }
        };
        creator2.notifications.unshift(notification);

        await creator2.save();

        return res.status(201).json({ message: "Request Sent!!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error processing request" });
    }
}

const approve = async (req, res) => {
    const { username, buzzSpaceName, approverId, index } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found');

        // Find the buzzspace by name
        const buzzSpace = await BuzzSpace.findOne({ name: buzzSpaceName });
        if (!buzzSpace) throw new Error('BuzzSpace not found');

        if (buzzSpace.moderators.includes(user._id)) {
            return res.status(400).json({ message: "User is already a moderator of this buzzspace" });
        }

        // Add the user as a moderator
        buzzSpace.moderators.push(user._id);
        await buzzSpace.save();
        const notificationMessage = `Congragulations you are now a moderator at ${buzzSpace.name}`;
        const notification = {
            type: 'buzzspace',
            message: notificationMessage
        };
        user.notifications.unshift(notification);

        await user.save();
        const approver = await User.findById(approverId);
        approver.notifications[index].request.approved = true
        await approver.save()

        return res.status(201).json({ message: "Moderator Added" });
    } catch (err) {
        console.log(err);
    }
}

const demoteModerator = async (req, res) => {
    const { buzzSpaceId, moderatorId } = req.body;

    try {
        // Find the buzzspace
        const buzzSpace = await BuzzSpace.findById(buzzSpaceId);
        if (!buzzSpace) {
            return res.status(404).json({ message: "BuzzSpace not found" });
        }

        // Check if the moderator exists in the buzzspace
        if (!buzzSpace.moderators.includes(moderatorId)) {
            return res.status(404).json({ message: "Moderator not found in this BuzzSpace" });
        }

        // Remove the moderator from the moderators list
        buzzSpace.moderators = buzzSpace.moderators.filter(id => id.toString() !== moderatorId.toString());
        const user = await User.findById(moderatorId);
        // Save the updated buzzspace
        await buzzSpace.save();
        const notificationMessage = `You are no longer a moderator at ${buzzSpace.name}`;
        const notification = {
            type: 'buzzspace',
            message: notificationMessage
        };
        user.notifications.unshift(notification);

        await user.save();
        return res.status(200).json({ message: "Moderator demoted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getJoinedUsers(buzzSpaceId) {
    try {
        const buzzSpace = await BuzzSpace.findById(buzzSpaceId).populate('moderators', '_id').populate('creator', '_id');
        if (!buzzSpace) {
            throw new Error('BuzzSpace not found');
        }

        const moderatorsAndCreatorIds = buzzSpace.moderators.map(mod => mod._id).concat(buzzSpace.creator._id);

        const users = await User.find({
            joined_buzzSpace_ids: buzzSpaceId,
            _id: { $nin: buzzSpace.moderators.map(mod => mod._id).concat(buzzSpace.creator._id) }
        });


        return users;
    } catch (error) {
        console.error('Error fetching users:', error.message);
        throw error;
    }
}


const clearNotification = async (req, res) => {
    const { UserId, notificationIndex } = req.body;
    try {
        const user = await User.findById(UserId);
        user.notifications.splice(notificationIndex, 1);
        await user.save()
        return res.status(201).json({ message: "Notofication deleted" });
    } catch (err) {
        console.log(err);
    }
}

module.exports = { createBuzzSpace, editBuzzSpace, joinBuzzSpace, leaveBuzzSpace, requestPromotion, approve, clearNotification, demoteModerator, getJoinedUsers };
