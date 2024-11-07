import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const prisma = new PrismaClient()
const app = express()

app.use(cors({
  origin: 'http://localhost:5173' 
}))
app.use(express.json())


// Serve static files from the uploads directory -- uploads the images to the uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

//file upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }
  res.json({ filename: req.file.filename })
})

// Lost items creation
app.post('/api/lost-items', async (req, res) => {
  try {
    console.log('Received request body:', req.body)
    
    const requiredFields = ['itemName', 'foundDate', 'finderName', 'finderEmail', 'locationFound', 'color', 'category', 'status', 'keyId']
    for (const field of requiredFields) {
      if (!req.body[field]) {
        console.log(`Missing required field: ${field}`)
        return res.status(400).json({ success: false, message: `Missing required field: ${field}` })
      }
    }

    const lostItem = await prisma.lostItem.create({
      data: {
        ...req.body,
        foundDate: new Date(req.body.foundDate)
      }
    })
    
    console.log('Created item:', lostItem)
    res.status(201).json({ success: true, data: lostItem })
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})