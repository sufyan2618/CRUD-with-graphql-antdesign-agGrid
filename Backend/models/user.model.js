import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
},
    email: { 
    type: String,
    required: true,
    trim: true,
},

    role: {
    type: String,
    enum: ['admin', 'user', 'moderator'],
    default: 'user',
},
status: {
    type: String,
    enum: ['active', 'banned', 'pending'],
    default: 'active',
}
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;
