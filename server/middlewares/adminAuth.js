import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//This function is made to authenticate admin rights
export const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  //Attach user info to the request object
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

//Compares the user id in the token with the user id in the database
export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
