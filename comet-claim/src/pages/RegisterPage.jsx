import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
    const [formData, setFormData] = useState({
        foundDate: '',
        finderName: '',
        finderEmail: '',
        itemFound: '',
        locationFound: '',
        roomNumber: '',
        color: '',
        category: '', 
        description: '',
        status: 'Lost', 
        keyId: Math.random().toString(36).substr(2, 6).toUpperCase() // Generate random ID. 6 digits
    })
    
    const [imagePreview, setImagePreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageFile, setImageFile] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
        ...prev,
        [name]: value
        }))
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
        setImageFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
        }
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        let imageUrl = null;
        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);

            const uploadResponse = await fetch('http://localhost:3001/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload image');
            }

            const uploadData = await uploadResponse.json();
            imageUrl = uploadData.filename;
        }

        const response = await fetch('http://localhost:3001/api/lost-items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemName: formData.itemFound,
                foundDate: new Date(formData.foundDate).toISOString(),
                finderName: formData.finderName,
                finderEmail: formData.finderEmail,
                locationFound: formData.locationFound,
                roomNumber: formData.roomNumber || null,
                color: formData.color,
                category: formData.category,
                description: formData.description || '',
                status: 'Lost',
                keyId: formData.keyId,
                imageUrl: imageUrl
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to submit form');
        }

        toast.success('Item registered successfully!', {
            position: "top-right",
            autoClose: 5000,
        });

        setFormData({
            foundDate: '',
            finderName: '',
            finderEmail: '',
            itemFound: '',
            locationFound: '',
            roomNumber: '',
            color: '',
            category: '',
            description: '',
            status: 'Found',
            keyId: Math.random().toString(36).substr(2, 6).toUpperCase()
        });
        setImagePreview(null);
        setImageFile(null);

    } catch (error) {
        console.error('Form submission error:', error);
        toast.error(error.message || 'Failed to register item. Please try again.', {
            position: "top-right",
            autoClose: 5000,
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Register New Item</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="foundDate" className="block mb-2">Found Date:</label>
            <input
              id="foundDate"
              className="w-full p-2 rounded-md bg-[#FFF1EC] border-[#E37B54] border"
              name="foundDate"
              value={formData.foundDate}  
              onChange={handleChange}     
              type="date"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Finder Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="finderName" className="block mb-2">Finder name:</label>
                <input
                  id="finderName"
                  name="finderName"
                  type="text"
                  value={formData.finderName}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-[#FFF1EC] border-[#E37B54] border"
                  required
                />
              </div>
              <div>
                <label htmlFor="finderEmail" className="block mb-2">Finder email:</label>
                <input
                  id="finderEmail"
                  name="finderEmail"
                  type="email"
                  value={formData.finderEmail}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-[#FFF1EC] border-[#E37B54] border"
                  required
                />
              </div>
            </div>
          </div>
          {/* {Main End} */}
          {/* Item Information section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Item Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="itemFound" className="block mb-2">Item found:</label>
                <input
                  id="itemFound"
                  name="itemFound"
                  type="text"
                  value={formData.itemFound}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-[#FFF1EC] border-[#E37B54] border"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="locationFound" className="block mb-2">Location found:</label>
                  <input
                    id="locationFound"
                    name="locationFound"
                    type="text"
                    value={formData.locationFound}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md bg-[#FFF1EC] border-[#E37B54] border"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="roomNumber" className="block mb-2">Room number:</label>
                  <input
                    id="roomNumber"
                    name="roomNumber"
                    type="text"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md bg-[#FFF1EC] border-[#E37B54] border"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="color" className="block mb-2">Color:</label>
                <input
                  id="color"
                  name="color"
                  type="text"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-[#FFF1EC] border-[#E37B54] border"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Item Image:</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-2 rounded-md bg-[#FFF1EC] border-[#E37B54] border"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Item preview"
                        className="max-w-xs rounded-md border border-[#E37B54]"
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    Upload a clear image of the found item
                  </p>
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block mb-2">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md bg-[#FFF1EC] border-[#E37B54] border h-32"
                  required
                />
              </div>
                <div>
                    <label htmlFor="category" className="block mb-2">Category:</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md bg-[#FFF1EC] border-[#E37B54] border"
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
          </div>
          {/* Item Information End */}
          {/* Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#2A9D8F] text-white py-3 rounded-full hover:bg-[#238276] disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Register Lost Item'}
          </button>
          {/* Button End */}
        </form>
      </div>

      <ToastContainer />
    </div>
  )
}

export default App