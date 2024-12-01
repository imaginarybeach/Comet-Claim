// src/components/AdminPage.js
import React, { useState } from 'react';
import { setRole } from '../auth/authService';
import { toast, ToastContainer } from 'react-toastify';

function AdminPage() {
  const [uid, setUid] = useState('');
  const [role, setRoleState] = useState('staff');

  const handleSetRole = async () => {
    try {
      await setRole(uid, role);
      console.log(`Role ${role} set for user ${uid}`);
    } catch (error) {
      console.log('Error setting role');
    }
  };

  return (
    <div className="flex-1 p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Admin Page</h1>
      <div>
        <label className="block mb-2">User ID:</label>
        <input className="w-full p-2 rounded-md bg-[#FFF1EC] border-[#E37B54] border" type="text" value={uid} onChange={(e) => setUid(e.target.value)} />
      </div>
      <div>
        <label className="block mb-2">Role:</label>
        <select className="w-full p-2 rounded-md bg-[#FFF1EC] border-[#E37B54] border block mb-10" value={role} onChange={(e) => setRoleState(e.target.value)}>
          <option value="staff">Staff</option>
          <option value="student">Student</option>
        </select>
      </div>
      <button className="w-full bg-[#2A9D8F] text-white py-3 rounded-full hover:bg-[#238276] disabled:opacity-50" onClick={handleSetRole}>Set Role</button>
      <ToastContainer/>
    </div>
  );
}

export default AdminPage;
