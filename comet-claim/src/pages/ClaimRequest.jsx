import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

export default function ClaimRequest() {
  const [lostItems, setLostItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [claimDescription, setClaimDescription] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLostItems();
  }, []);

  const fetchLostItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/lost-items?status=Lost');
      const data = await response.json();
      setLostItems(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch lost items');
      setLoading(false);
    }
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!selectedItem || !claimDescription || !name || !email) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const claimData = {
        lostItemId: selectedItem.id,
        studentName: name,
        studentEmail: email,
        description: claimDescription,
      };

      const response = await fetch('http://localhost:3001/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claimData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit claim');
      }

      setSelectedItem(null);
      setClaimDescription('');
      setName('');
      setEmail('');
      setError(null);
      alert('Claim request submitted successfully! The staff will review your claim.');
      
      fetchLostItems();
    } catch (err) {
      console.error('Error submitting claim:', err);
      setError(err.message || 'Failed to submit claim request');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" data-testid="loading">
      <div className="text-xl">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen" data-testid="error">
      <div className="text-xl text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Claim Lost Item</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded" data-testid="error-message">
          {error}
        </div>
      )}
      
      {/* Lost Items List */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Available Lost Items</h2>
        {lostItems.length === 0 ? (
          <p className="text-gray-600">No lost items available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lostItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedItem?.id === item.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
                data-testid={`item-${item.id}`}
                onClick={() => {
                  if (item.status === 'Lost') {
                    setSelectedItem(item);
                    setError(null);
                  }
                }}
              >
                {item.imageUrl && (
                  <img
                    src={`http://localhost:3001/uploads/${item.imageUrl}`}
                    alt={item.itemName}
                    className="w-full h-48 object-cover mb-4 rounded"
                    data-testid={`item-image-${item.id}`}
                  />
                )}
                <h3 className="font-semibold text-lg text-gray-800" data-testid={`item-name-${item.id}`}>{item.itemName}</h3>
                <p className="text-sm text-gray-600" data-testid={`item-category-${item.id}`}>Category: {item.category}</p>
                <p className="text-sm text-gray-600" data-testid={`item-location-${item.id}`}>Location: {item.locationFound}</p>
                <p className="text-sm text-gray-600" data-testid={`item-date-${item.id}`}>Found Date: {new Date(item.foundDate).toLocaleDateString()}</p>
                <p className={`text-sm mt-2 ${
                  item.status === 'Lost' ? 'text-green-600' : 'text-yellow-600'
                }`} data-testid={`item-status-${item.id}`} >
                  Status: {item.status === 'Lost' ? 'Available' : 'Pending Review'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Claim Form */}
      {selectedItem && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Submit Claim Request</h2>
          <form onSubmit={handleSubmitClaim} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                data-testid="input-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                data-testid="input-email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={claimDescription}
                onChange={(e) => setClaimDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="4"
                placeholder="Please describe why you believe this item belongs to you..."
                required
                data-testid="input-description"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              data-testid="submit-button"
            >
              Submit Claim
            </button>
          </form>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
}
