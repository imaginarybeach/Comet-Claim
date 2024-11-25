import admin from './firebaseAdmin.js';

export const decodeToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    if (token) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } else {
      return res.status(403).send('Unauthorized');
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return res.status(403).send('Unauthorized');
  }
};


