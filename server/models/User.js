import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {   type: String, required: true, unique: true },
    email: {      type: String, required: true, unique: true },
    password: {   type: String, required: true },
    firstName: {  type: String, required: true },
    lastName: {   type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isAdmin: {   type: Boolean, default: false },
    isActive: {  type: Boolean, default: true },
    bio: {       type: String, default: null },
    },
    { timestamps: true }
);

//Hash password before saving user to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//Compare password method
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

//Find user by username
userSchema.statics.findByUsername = async function (username) {
    try {
        return await this.findOne({ username });
    } catch (error) {
        throw new Error(error);
    }
    }

const User = mongoose.model('User', userSchema);
export default User;
