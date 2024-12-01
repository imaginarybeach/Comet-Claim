import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Initialize Prisma Client with error handling
let prisma
try {
  prisma = new PrismaClient()
  await prisma.$connect()
  console.log('Successfully connected to the database')
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error)
  process.exit(1)
}

const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',  
  allowedHeaders: ['Content-Type', 'Authorization', 'Referer']  
}));
app.use(express.json())
app.use(bodyParser.json());

// Serve static files from the uploads directory
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
  res.json({ imageUrl: req.file.filename })
})

// Lost items endpoints
app.post('/api/lost-items', async (req, res) => {
  try {
    console.log('Received request body:', req.body)
    
    const requiredFields = ['itemName', 'foundDate', 'finderName', 'finderEmail', 'locationFound', 'color', 'category', 'status', 'keyId']
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` })
      }
    }

    const lostItem = await prisma.lostItem.create({
      data: {
        itemName: req.body.itemName,
        foundDate: new Date(req.body.foundDate),
        finderName: req.body.finderName,
        finderEmail: req.body.finderEmail,
        locationFound: req.body.locationFound,
        description: req.body.description || '',
        color: req.body.color,
        category: req.body.category,
        status: req.body.status,
        keyId: req.body.keyId,
        imageUrl: req.body.imageUrl || null
      }
    })
    res.json(lostItem)
  } catch (error) {
    console.error('Error creating lost item:', error)
    res.status(500).json({ error: 'Failed to create lost item' })
  }
})

app.get('/api/lost-items', async (req, res) => {
  try {
    const lostItems = await prisma.lostItem.findMany({
      orderBy: {
        foundDate: 'desc'
      }
    })
    res.json(lostItems)
  } catch (error) {
    console.error('Error fetching lost items:', error)
    res.status(500).json({ error: 'Failed to fetch lost items' })
  }
})

app.post('/api/claims', async (req, res) => {
  try {
    const { lostItemId, studentName, studentEmail, description } = req.body;
    console.log('Received claim request:', req.body);

    // Validate required fields
    if (!lostItemId || !studentName || !studentEmail || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if item exists and is still available
    const existingItem = await prisma.lostItem.findUnique({
      where: { id: lostItemId },
      include: {
        claimRequests: true
      }
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (existingItem.status !== 'Lost') {
      return res.status(400).json({ error: 'This item is no longer available for claims' });
    }

    // Check if user has already claimed this item
    const existingClaim = await prisma.claimRequest.findFirst({
      where: {
        lostItemId,
        studentEmail,
        status: {
          in: ['Pending', 'Approved']
        }
      }
    });

    if (existingClaim) {
      return res.status(400).json({ error: 'You have already submitted a claim for this item' });
    }

    // Create the claim and update item status in a transaction
    const [claim] = await prisma.$transaction([
      prisma.claimRequest.create({
        data: {
          lostItem: {
            connect: { id: lostItemId }
          },
          studentName,
          studentEmail,
          description,
          status: 'Pending'
        }
      }),
      prisma.lostItem.update({
        where: { id: lostItemId },
        data: { status: 'Pending' }
      })
    ]);

    console.log('Created claim:', claim);
    res.status(201).json(claim);
  } catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({ error: 'Failed to create claim' });
  }
})

// Get claims for a specific item
app.get('/api/claims/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log('Fetching claims for item:', itemId);
    const claims = await prisma.claimRequest.findMany({
      where: {
        lostItemId: itemId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log('Found claims:', claims);
    res.json(claims);
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

// Approve a claim
app.post('/api/claims/:claimId/approve', async (req, res) => {
  try {
    const { claimId } = req.params;
    console.log('Approving claim:', claimId);

    // Start a transaction to update both claim and item
    const result = await prisma.$transaction(async (prisma) => {
      // Update the claim status
      const claim = await prisma.claimRequest.update({
        where: { id: claimId },
        data: { status: 'Approved' },
        include: { lostItem: true }
      });

      // Update the item status
      await prisma.lostItem.update({
        where: { id: claim.lostItemId },
        data: { status: 'Claimed' }
      });

      // Reject all other pending claims for this item
      await prisma.claimRequest.updateMany({
        where: {
          lostItemId: claim.lostItemId,
          id: { not: claimId },
          status: 'Pending'
        },
        data: { status: 'Rejected' }
      });

      return claim;
    });

    console.log('Approved claim:', result);
    res.json(result);
  } catch (error) {
    console.error('Error approving claim:', error);
    res.status(500).json({ error: 'Failed to approve claim' });
  }
});

// Reject a claim
app.post('/api/claims/:claimId/reject', async (req, res) => {
  try {
    const { claimId } = req.params;
    console.log('Rejecting claim:', claimId);
    
    const claim = await prisma.claimRequest.update({
      where: { id: claimId },
      data: { status: 'Rejected' },
      include: { lostItem: true }
    });

    // If this was the last pending claim, update item status back to Lost
    const pendingClaims = await prisma.claimRequest.count({
      where: {
        lostItemId: claim.lostItemId,
        status: 'Pending'
      }
    });

    if (pendingClaims === 0) {
      await prisma.lostItem.update({
        where: { id: claim.lostItemId },
        data: { status: 'Lost' }
      });
    }

    console.log('Rejected claim:', claim);
    res.json(claim);
  } catch (error) {
    console.error('Error rejecting claim:', error);
    res.status(500).json({ error: 'Failed to reject claim' });
  }
});

const port = 3001
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})