import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

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
        ...req.body,
        foundDate: new Date(req.body.foundDate),
      }
    })

    res.status(201).json({ message: 'Item created successfully', data: lostItem })
  } catch (error) {
    console.error('Error creating lost item:', error)
    res.status(500).json({ message: 'Error creating lost item: ' + error.message })
  }
}