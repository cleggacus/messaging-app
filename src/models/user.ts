const mongoose = require('mongoose');

const followingSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    createdAt: {type: Date, default: Date.now}
})

const notificationSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    type: { type: Number, required: true }, // follow: 0
    extra: { type: String, default: '' },
    createdAt: {type: Date, default: Date.now},
    seen: { type: Boolean, default: false }
})

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { 
        type: String, 
        required: true, 
        unique: true
    },
    password: { type: String, required: true },
    createdAt: {type: Date, default: Date.now},
    theme: {type: Number, default: 1}, // black: 2; dark: 1; light: 0;
    status: {type: String, default: 'Beep Boop Beep Boop'},
    picture: {type: String, default: 'default'},
    following: [followingSchema],
    notifications: [notificationSchema]
});

export default mongoose.model('User', userSchema);