import { useState, useEffect } from 'react'
import { FiSearch, FiFilter } from 'react-icons/fi'
import { auth } from '../firebase/firebaseConfig';
import { ToastContainer } from 'react-toastify';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('ALL')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [claimRequests, setClaimRequests] = useState([])
  const [showClaimModal, setShowClaimModal] = useState(false)

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Accessories',
    'Other'
  ]

  const fetchItems = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken(true);
        console.log('ID Token:', idToken); 
        const response = await fetch('http://localhost:3001/api/lost-items', {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        setItems(data);
        setFilteredItems(data);
      } else {
        console.log('User not authenticated');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusClick = async (item) => {
    console.log('Status clicked for item:', item);
    setSelectedItem(item);
    try {
      const response = await fetch(`http://localhost:3001/api/claims/${item.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch claims');
      }
      const claims = await response.json();
      console.log('Received claims:', claims);
      setClaimRequests(claims);
      setShowClaimModal(true);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const handleApprove = async (claimId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/claims/${claimId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to approve claim');
      }
      // Refresh the claims list and items list
      handleStatusClick(selectedItem);
      fetchItems();
    } catch (error) {
      console.error('Error approving claim:', error);
    }
  };

  const handleReject = async (claimId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/claims/${claimId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to reject claim');
      }
      // Refresh the claims list and items list
      handleStatusClick(selectedItem);
      fetchItems();
    } catch (error) {
      console.error('Error rejecting claim:', error);
    }
  };

  const handleClaimAction = async (claimId, action) => {
    try {
      const response = await fetch(`http://localhost:3001/api/claims/${claimId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} claim`);
      }

      // Refresh claim requests and items list
      handleStatusClick(selectedItem);
      fetchItems();
    } catch (error) {
      console.error(`Error ${action}ing claim:`, error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    let filtered = items;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by tab
    if (activeTab === 'LOST') {
      filtered = filtered.filter(item => item.status === 'Lost');
    } else if (activeTab === 'PENDING') {
      filtered = filtered.filter(item => item.status === 'Pending');
    } else if (activeTab === 'CLAIMED') {
      filtered = filtered.filter(item => item.status === 'Claimed');
    }

    // Apply sort
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.foundDate);
      const dateB = new Date(b.foundDate);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, activeTab, sortOrder, items]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Lost and Found Items</h1>
      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 ${activeTab === 'ALL' ? 'border-b-2 border-[#E37B54] text-[#E37B54]' : ''}`}
          >
            ALL ENTRIES
          </button>
          <button 
            onClick={() => setActiveTab('LOST')}
            className={`px-4 py-2 ${activeTab === 'LOST' ? 'border-b-2 border-[#E37B54] text-[#E37B54]' : ''}`}
          >
            LOST ITEMS
          </button>
          <button 
            onClick={() => setActiveTab('PENDING')}
            className={`px-4 py-2 ${activeTab === 'PENDING' ? 'border-b-2 border-[#E37B54] text-[#E37B54]' : ''}`}
          >
            PENDING ITEMS
          </button>
          <button 
            onClick={() => setActiveTab('CLAIMED')}
            className={`px-4 py-2 ${activeTab === 'CLAIMED' ? 'border-b-2 border-[#E37B54] text-[#E37B54]' : ''}`}
          >
            CLAIMED ITEMS
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by item name or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pr-10 rounded-md bg-[#FFF1EC] border-[#E37B54] border"
          />
          <FiSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#2A9D8F] text-white rounded-md"
        >
          <FiFilter />
          <span>Filter</span>
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-[#FFF1EC] rounded-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 rounded-md border-[#E37B54] border"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Sort by Date</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-2 rounded-md border-[#E37B54] border"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>
      )}

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Item Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Color</th>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Found Date</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Finder</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Key ID</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-4">Loading...</td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No items found. Try adjusting your search criteria.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{item.itemName}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">{item.color}</td>
                  <td className="px-6 py-4">
                    {item.imageUrl && (
                      <img
                        src={`http://localhost:3001/uploads/${item.imageUrl}`}
                        alt={item.itemName}
                        className="w-16 h-16 object-cover cursor-pointer"
                        onClick={() => setSelectedImage(item.imageUrl)}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4">{new Date(item.foundDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{item.locationFound}</td>
                  <td className="px-6 py-4">{item.finderName}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusClick(item)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.status === 'Lost' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="px-6 py-4">{item.keyId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Claims Modal */}
      {showClaimModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Claims for {selectedItem.itemName}
              </h3>
              <button
                onClick={() => setShowClaimModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {claimRequests && claimRequests.length > 0 ? (
              <div className="space-y-4">
                {claimRequests.map((claim) => (
                  <div key={claim.id} className="border p-4 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p><strong>Student Name:</strong> {claim.studentName}</p>
                        <p><strong>Student Email:</strong> {claim.studentEmail}</p>
                        <p><strong>Status:</strong> {claim.status}</p>
                        <p><strong>Description:</strong> {claim.description}</p>
                        <p><strong>Submitted:</strong> {new Date(claim.createdAt).toLocaleString()}</p>
                      </div>
                      {claim.status === 'Pending' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleApprove(claim.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(claim.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No claims for this item.</p>
            )}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={`http://localhost:3001/uploads/${selectedImage}`}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
      <ToastContainer/>
    </div>
  );
}