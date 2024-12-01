import { useState, useEffect } from 'react'
import { FiSearch, FiFilter } from 'react-icons/fi'
import { auth } from '../firebase/firebaseConfig';

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
      const response = await fetch('http://localhost:3001/api/search', {
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

useEffect(() => {
  fetchItems();
}, []);


  useEffect(() => {
    let filtered = items

    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (activeTab !== 'ALL') {
      const statusMap = {
        'LOST': 'Lost',
        'FOUND': 'Unclaimed',
        'CLAIMED': 'Claimed'
      }
      filtered = filtered.filter(item => item.status === statusMap[activeTab])
    }

    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.foundDate)
      const dateB = new Date(b.foundDate)
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })

    setFilteredItems(filtered)
  }, [searchQuery, selectedCategory, activeTab, sortOrder, items])

  return (
    <div className="flex-1 p-8">
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
            onClick={() => setActiveTab('FOUND')}
            className={`px-4 py-2 ${activeTab === 'FOUND' ? 'border-b-2 border-[#E37B54] text-[#E37B54]' : ''}`}
          >
            FOUND ITEMS
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
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2">Item Name</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Color</th>
              <th className="pb-2">Image</th>
              <th className="pb-2">Found Date</th>
              <th className="pb-2">Location</th>
              <th className="pb-2">Finder</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Key ID</th>
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
                  <td className="py-3">{item.itemName}</td>
                  <td>{item.category}</td>
                  <td>{item.color}</td>
                  <td className="py-3">
                    {item.imageUrl ? (
                      <img
                        src={`http://localhost:3001/uploads/${item.imageUrl}`}
                        alt={item.itemName}
                        className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImage(item.imageUrl)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/no-image.png'
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </td>
                  <td>{new Date(item.foundDate).toLocaleDateString()}</td>
                  <td>{item.locationFound}</td>
                  <td>{item.finderName}</td>
                  <td>{item.status}</td>
                  <td>{item.keyId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100"
              onClick={() => setSelectedImage(null)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
            <img
              src={`http://localhost:3001/uploads/${selectedImage}`}
              alt="Full size"
              className="max-w-full h-auto rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/no-image.png'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}