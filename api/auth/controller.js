
const User = require('./../users/model');
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {

        const user = new User(req.body);
        user.created = new Date();
        user.modified = new Date();
        const newSaved = await user.save();
        
        const token = signToken(newSaved);
        
        const returnUser= {
            firstName: newSaved.firstName,
            lastName: newSaved.lastName,
            email: newSaved.email,
            role: newSaved.role
        }
    
        res.status(201).json({ message: 'User Created', data:returnUser , token });

}

exports.login = async (req, res) => {
    let {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({status: "Fail", message: "Please provide email and password"})
    }
    const userExists = await User.findOne({email: email});

    if (!userExists || !userExists.authenticate(password)) {
        return res.status(400).json({status: "Fail", message: "Invalid credentials"})
    }
    const token = signToken(userExists);
    
    const returnUser = {
        firstName: userExists.firstName,
        lastName: userExists.lastName,
        email: userExists.email,
        role: userExists.role
    }
    
    return res.status(200).json({status: "success", token, data:returnUser})
}

const signToken = (user) => {
    return jwt.sign({sub: user.id, email: user.email},"mysecret", {})
}

exports.isLandlord = (req, res, next) => {
    if (req.user.role === 'landlord' || req.user.role === 'admin') {
        return next();
    }else{
        return res.status(403).json({message: 'You are not authorized to access this resource'})

    }
}
exports.isAdmin = (req, res, next) =>{
    if (req.user.role === 'admin') {
        return next();
    }else{
        return res.status(403).json({message: 'You are not authorized to access this resource'})

    }
}

