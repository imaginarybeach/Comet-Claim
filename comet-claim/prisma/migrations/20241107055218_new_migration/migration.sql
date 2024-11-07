-- CreateTable
CREATE TABLE "LostItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "imageUrl" TEXT,
    "foundDate" DATETIME NOT NULL,
    "locationFound" TEXT NOT NULL,
    "finderName" TEXT NOT NULL,
    "finderEmail" TEXT NOT NULL,
    "roomNumber" TEXT,
    "description" TEXT,
    "dateReceived" DATETIME,
    "receiverName" TEXT,
    "receiverEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Lost',
    "keyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LostItem_keyId_key" ON "LostItem"("keyId");
