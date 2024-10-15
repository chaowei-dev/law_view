-- CreateTable
CREATE TABLE "IsHideUpdateAt" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "caseId" INTEGER NOT NULL,

    CONSTRAINT "IsHideUpdateAt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IsHideUpdateAt_caseId_key" ON "IsHideUpdateAt"("caseId");

-- AddForeignKey
ALTER TABLE "IsHideUpdateAt" ADD CONSTRAINT "IsHideUpdateAt_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
