const Buzz = require('../models/Buzz');

const createBuzz = async (req, res) => {
    try {
        const { buzzSpaceName, buzz, title } = req.body;
        const newBuzz = new Buzz({
            buzzSpaceName: buzzSpaceName,
            buzz: buzz,
            title: title
        });
        await newBuzz.save();
        res.status(201).send('Buzz created.');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

const editBuzz = async (req, res) => {
    const{title, buzz} = req.body;
    const buzzId = req.params.id;
    let buzz1;
    try{
        buzz1 = await Buzz.findByIdAndUpdate(buzzId, {
            title,
            buzz
        })
    }catch(err){
        return console.log(err);
    }
    if(!buzz1) return res.status(500).json({message: "Error updating Buzz"})

    return res.status(200).json({buzz1})
}

module.exports = { createBuzz, editBuzz };
