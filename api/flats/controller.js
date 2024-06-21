const Flat = require("./model");
exports.createFlats = async (req, res) => {
  try {
    const flat = new Flat(req.body);
    flat.created = new Date();
    flat.modified = new Date(); 
    flat.ownerID = req.user._id;
    await flat.save();
    return res.status(201).json({message: 'Flat Created', data: flat});
  } catch (error) {
    return res.status(400).json({message: 'Fail', data: error});
  }
};

exports.getAllFlats = async (req, res) => {
  const flats = await Flat.find().populate('ownerID').exec();
  return res.status(200).json({message: 'Flats', data: flats});
};
