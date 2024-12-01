import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createClaimRequest = async (req, res) => {
  try {
    const { lostItemId, studentName, studentEmail, description } = req.body;

    // Create the claim request
    const claimRequest = await prisma.claimRequest.create({
      data: {
        lostItemId,
        studentName,
        studentEmail,
        description,
      },
    });

    // Update the lost item status
    await prisma.lostItem.update({
      where: { id: lostItemId },
      data: { status: 'Pending' },
    });

    res.status(201).json(claimRequest);
  } catch (error) {
    console.error('Error creating claim request:', error);
    res.status(500).json({ error: 'Failed to create claim request' });
  }
};

export const getClaimRequests = async (req, res) => {
  try {
    const claims = await prisma.claimRequest.findMany({
      include: {
        lostItem: true,
      },
    });

    res.json(claims);
  } catch (error) {
    console.error('Error fetching claim requests:', error);
    res.status(500).json({ error: 'Failed to fetch claim requests' });
  }
};
