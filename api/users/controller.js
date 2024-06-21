
const User = require('./model');
exports.update = (req, res) => {
    
    res.status(200).json({ message: 'User Updated' });
}

exports.getAllUsers = async (req, res) => {
    const filter = req.query.filter || {};
    
    const queryFilter = {}
    
    if (filter.role){
        queryFilter.role= {
            $eq: filter.role
        }
    }
    

    if (filter.flatCountMin){
        queryFilter.flatCount= {
            $gte: parseInt(filter.flatCountMin)
        }
    }
    if (filter.flatCountMax){
        queryFilter.flatCount= {
            $lte: parseInt(filter.flatCountMax)
        }
    }
    
    if (filter.flatCountMin && filter.flatCountMax){
        queryFilter.flatCount= {
            $gte: parseInt(filter.flatCountMin),
            $lte: parseInt(filter.flatCountMax)
        }
    }
    
    
    const orderBy = req.query.orderBy || 'firstName';
    const order = parseInt(req.query.order) || 1;
    
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const skip = (page - 1) * limit;
    
    const users = await User.aggregate([
        { $lookup:
                {
                    from: 'flats',
                    localField: '_id',
                    foreignField: 'ownerID',
                    as: 'flats'
                },
        },
        {
            $addFields: {
                flatCount: { $size: '$flats' },
            }
        },
        {
            $match: queryFilter
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
        {$sort: { [orderBy]: order }}
        
    ]);
    

    res.status(200).json({message: 'Users', data: users});
}
