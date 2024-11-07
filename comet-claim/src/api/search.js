import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { search, category, sortOrder } = req.query

  try {
    const items = await prisma.lostItem.findMany({
      where: {
        AND: [
          {
            OR: [
              { itemName: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
          category ? { category } : {},
        ],
      },
      orderBy: {
        foundDate: sortOrder || 'desc',
      },
    })

    res.status(200).json(items)
  } catch (error) {
    console.error('Error searching items:', error)
    res.status(500).json({ message: 'Error searching items' })
  }
}