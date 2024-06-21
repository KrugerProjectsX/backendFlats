
const mongoose = require('mongoose') ;
const bcrypt = require('bcryptjs') ;
const Schema = mongoose.Schema ;

const UserSchema = new Schema({
    birthDate: {
        type: Date,
        required: [true, 'please provide birthDate'],
    }, 
    email: {
        type: String,
        unique: true,
        required: [true, 'please provide email']
    },
    firstName: {
        type: String,
        required: [true, 'please provide firstName']
    },
    lastName: {
        type: String,
        required: [true, 'please provide lastName']
    },
    password: {
        type: String,
        required: [true , 'please provide password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['landlord', 'renter', 'admin'],
        default: 'renter',
    },
    created: Date,
    modified: Date,
});

UserSchema.pre('save', async function(next){
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next() ;
});
UserSchema.methods = {
    authenticate: function(password){
        return bcrypt.compareSync(password, this.password);
    }
}

module.exports = mongoose.model('users', UserSchema) ;
