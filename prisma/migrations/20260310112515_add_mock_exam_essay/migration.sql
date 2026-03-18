-- AlterTable
ALTER TABLE "EssayQuestion" ADD COLUMN "examNumber" INTEGER;

-- CreateTable
CREATE TABLE "EssayAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "essayQuestionId" TEXT NOT NULL,
    "selfScore" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EssayAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EssayAttempt_essayQuestionId_fkey" FOREIGN KEY ("essayQuestionId") REFERENCES "EssayQuestion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MockExamResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "examNumber" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "percentage" REAL NOT NULL,
    "timeSeconds" INTEGER,
    "answers" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MockExamResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
