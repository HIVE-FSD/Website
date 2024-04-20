const User = require("../models/User.js");
const BuzzSpace = require("../models/BuzzSpace.js");
const Buzz = require("../models/Buzz.js");

const authUserBuzzSpace = async(req, res, next) => {
    try{
        const buzzSpaceId = req.body.buzzSpaceId;
        const userId = req.body.userId;
        let set = 0;
        const buzzSpace = await BuzzSpace.findById(buzzSpaceId)
        console.log(buzzSpace.creator)
        console.log(userId)
        if(buzzSpace.creator == userId || buzzSpace.moderators.includes(userId)){
            console.log(buzzSpaceId)
            next();
        }
        else return res.status(401).json("You don't have permission");
    }catch(err){
        console.log(err)
    }
};

const authUserBuzz = async(req, res, next) => {
    try{
        const userId = req.body.userId;
        const buzzId = req.body.buzzId;
        const buzz = await Buzz.findById(buzzId);
        const buzzspace = await BuzzSpace.findById(buzz.buzzSpace);
        if(buzzspace.moderators.includes(userId) || buzzspace.creator == userId || buzz.buzzer == userId)
        next();
        else return res.status(401).json("You don't have permission");
    }catch(err){
        console.log(err);
    }
};

module.exports = { authUserBuzzSpace, authUserBuzz };