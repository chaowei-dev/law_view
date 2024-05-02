/*
  Warnings:

  - You are about to drop the column `case` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `full` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `no` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Case` table. All the data in the column will be lost.
  - Added the required column `jcase` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jdate` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jfull` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jno` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jtitle` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jyear` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Case" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jid" TEXT NOT NULL,
    "jyear" INTEGER NOT NULL,
    "jcase" TEXT NOT NULL,
    "jno" INTEGER NOT NULL,
    "jdate" TEXT NOT NULL,
    "jtitle" TEXT NOT NULL,
    "jfull" TEXT NOT NULL
);
INSERT INTO "new_Case" ("id", "jid") SELECT "id", "jid" FROM "Case";
DROP TABLE "Case";
ALTER TABLE "new_Case" RENAME TO "Case";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
