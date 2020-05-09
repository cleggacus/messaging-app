const mongoose = require('mongoose');

const messagaingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
});

export default mongoose.model('User', messagaingSchema);