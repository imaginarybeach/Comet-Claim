import admin from './firebaseAdminConfig.js';

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Received Token:', token); 

  if (!token) {
    console.log('No token provided');
    res.status(403).json({ message: 'Unauthorized, invalid or expired token' });

  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Decoded Token:', decodedToken);  
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error.code, error.message);
    res.status(403).json({ message: 'Unauthorized, invalid or expired token' });

  }
};

