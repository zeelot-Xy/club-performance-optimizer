-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('COACH_ADMIN');

-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'INJURED');

-- CreateEnum
CREATE TYPE "PositionGroup" AS ENUM ('GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD');

-- CreateEnum
CREATE TYPE "PreferredFoot" AS ENUM ('LEFT', 'RIGHT', 'BOTH', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "InjuryStatus" AS ENUM ('FIT', 'MINOR_KNOCK', 'INJURED');

-- CreateEnum
CREATE TYPE "SuspensionStatus" AS ENUM ('ELIGIBLE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "MatchWeekStatus" AS ENUM ('DRAFT', 'READY', 'COMPLETED');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('DRAFT', 'FINAL', 'FAILED');

-- CreateEnum
CREATE TYPE "RecommendationPlayerRole" AS ENUM ('GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD', 'BENCH', 'EXCLUDED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('LOGIN', 'LOGOUT', 'PLAYER_CREATED', 'PLAYER_UPDATED', 'MATCH_WEEK_CREATED', 'WEEKLY_PERFORMANCE_UPSERTED', 'RECOMMENDATION_GENERATED');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'COACH_ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "squadNumber" INTEGER NOT NULL,
    "primaryPosition" TEXT NOT NULL,
    "secondaryPosition" TEXT,
    "positionGroup" "PositionGroup" NOT NULL,
    "preferredFoot" "PreferredFoot" NOT NULL DEFAULT 'UNKNOWN',
    "age" INTEGER NOT NULL,
    "heightCm" INTEGER,
    "status" "PlayerStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchWeek" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "opponentName" TEXT,
    "matchDate" TIMESTAMP(3) NOT NULL,
    "status" "MatchWeekStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "MatchWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyPerformance" (
    "id" TEXT NOT NULL,
    "matchWeekId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "trainingRating" INTEGER NOT NULL,
    "fitness" INTEGER NOT NULL,
    "fatigue" INTEGER NOT NULL,
    "morale" INTEGER NOT NULL,
    "availability" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
    "injuryStatus" "InjuryStatus" NOT NULL DEFAULT 'FIT',
    "suspensionStatus" "SuspensionStatus" NOT NULL DEFAULT 'ELIGIBLE',
    "coachNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formation" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "defenders" INTEGER NOT NULL,
    "midfielders" INTEGER NOT NULL,
    "forwards" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Formation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "matchWeekId" TEXT NOT NULL,
    "formationId" TEXT NOT NULL,
    "generatedById" TEXT NOT NULL,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'DRAFT',
    "summary" TEXT NOT NULL,
    "ruleScoreSummary" TEXT NOT NULL,
    "mlSupportSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationPlayer" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "role" "RecommendationPlayerRole" NOT NULL,
    "startingPosition" TEXT,
    "isSelected" BOOLEAN NOT NULL,
    "computedScore" DECIMAL(5,2) NOT NULL,
    "selectionReason" TEXT,
    "exclusionReason" TEXT,
    "rankOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Player_squadNumber_key" ON "Player"("squadNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MatchWeek_label_key" ON "MatchWeek"("label");

-- CreateIndex
CREATE INDEX "MatchWeek_matchDate_idx" ON "MatchWeek"("matchDate");

-- CreateIndex
CREATE INDEX "WeeklyPerformance_playerId_idx" ON "WeeklyPerformance"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyPerformance_matchWeekId_playerId_key" ON "WeeklyPerformance"("matchWeekId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Formation_code_key" ON "Formation"("code");

-- CreateIndex
CREATE INDEX "Recommendation_matchWeekId_idx" ON "Recommendation"("matchWeekId");

-- CreateIndex
CREATE INDEX "RecommendationPlayer_recommendationId_idx" ON "RecommendationPlayer"("recommendationId");

-- CreateIndex
CREATE INDEX "RecommendationPlayer_playerId_idx" ON "RecommendationPlayer"("playerId");

-- CreateIndex
CREATE INDEX "AuditLog_adminUserId_idx" ON "AuditLog"("adminUserId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- AddForeignKey
ALTER TABLE "MatchWeek" ADD CONSTRAINT "MatchWeek_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyPerformance" ADD CONSTRAINT "WeeklyPerformance_matchWeekId_fkey" FOREIGN KEY ("matchWeekId") REFERENCES "MatchWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyPerformance" ADD CONSTRAINT "WeeklyPerformance_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_matchWeekId_fkey" FOREIGN KEY ("matchWeekId") REFERENCES "MatchWeek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationPlayer" ADD CONSTRAINT "RecommendationPlayer_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationPlayer" ADD CONSTRAINT "RecommendationPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
