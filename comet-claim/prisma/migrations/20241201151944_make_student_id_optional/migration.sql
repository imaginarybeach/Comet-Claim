-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClaimRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lostItemId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "studentId" TEXT,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClaimRequest_lostItemId_fkey" FOREIGN KEY ("lostItemId") REFERENCES "LostItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ClaimRequest" ("createdAt", "description", "id", "lostItemId", "status", "studentEmail", "studentId", "studentName", "updatedAt") SELECT "createdAt", "description", "id", "lostItemId", "status", "studentEmail", "studentId", "studentName", "updatedAt" FROM "ClaimRequest";
DROP TABLE "ClaimRequest";
ALTER TABLE "new_ClaimRequest" RENAME TO "ClaimRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
