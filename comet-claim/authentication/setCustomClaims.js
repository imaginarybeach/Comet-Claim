import admin from './firebaseAdmin.js';

export const setCustomClaims = async (uid, role) => {
  try { 
    await admin.auth().setCustomUserClaims(uid, { role }); 
    console.log(`Custom claims set for user ${uid}: `, role); 
  }
  catch (error) { 
    console.error('Error setting custom claims:', error);
  }
};