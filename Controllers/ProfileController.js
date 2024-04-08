const Buzz = require("../models/Buzz");
const BuzzSpace = require("../models/BuzzSpace");

const fetchBuzzes = async (buzzIds) => {
    try {
        // Assuming you have a Buzz model
        const buzzes = [];
        for (const buzzId of buzzIds) {
            const buzz = await Buzz.findById(buzzId);
            buzzes.push(buzz);
        }
        return buzzes;
    } catch (error) {
        console.error('Error fetching buzzes:', error);
        throw error; // Forward the error to handle it in the calling function
    }
};

const fetchBuzzSpaces = async (buzzSpaceIds) => {
    try {
        // Assuming you have a BuzzSpace model
        const buzzSpaces = [];
        for (const buzzSpaceId of buzzSpaceIds) {
            const buzzSpace = await BuzzSpace.findById(buzzSpaceId);
            buzzSpaces.push(buzzSpace);
        }
        return buzzSpaces;
    } catch (error) {
        console.error('Error fetching buzzSpaces:', error);
        throw error; // Forward the error to handle it in the calling function
    }
};


module.exports = { fetchBuzzSpaces, fetchBuzzes };