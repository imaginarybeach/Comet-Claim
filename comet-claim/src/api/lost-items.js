import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return handleGetItems(req, res);
    case 'POST':
      return handleCreateItem(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function handleGetItems(req, res) {
  try {
    const { status } = req.query;

    const items = await prisma.lostItem.findMany({
      where: {
        status: status || 'Lost',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(items);
  } catch (error) {
    console.error('Error fetching lost items:', error);
    res.status(500).json({ message: 'Error fetching lost items: ' + error.message });
  }
}

async function handleCreateItem(req, res) {
  try {
    // Validate required fields
    const requiredFields = ['itemName', 'foundDate', 'finderName', 'finderEmail', 'locationFound', 'color', 'category', 'status', 'keyId']
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` })
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

    res.status(201).json({ message: 'Item created successfully', data: lostItem })
  } catch (error) {
    console.error('Error creating lost item:', error)
    res.status(500).json({ message: 'Error creating lost item: ' + error.message })
  }
}