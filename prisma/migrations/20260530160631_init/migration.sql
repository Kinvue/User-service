-- CreateEnum
CREATE TYPE "theme" AS ENUM ('LIGHT', 'DARK');

-- CreateEnum
CREATE TYPE "friend_status" AS ENUM ('ACCEPTED', 'DENIED', 'PENDING', 'BLOCKED');

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID NOT NULL,
    "auth_user_id" UUID NOT NULL,
    "username" VARCHAR(32) NOT NULL,
    "display_name" VARCHAR(64),
    "avatar_url" TEXT,
    "bio" VARCHAR(500),
    "status" VARCHAR(32) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "language" VARCHAR(5) NOT NULL DEFAULT 'en',
    "theme" "theme" NOT NULL DEFAULT 'LIGHT',
    "notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_friends" (
    "id" UUID NOT NULL,
    "requester_id" UUID NOT NULL,
    "receiver_id" UUID NOT NULL,
    "status" "friend_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_friends_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_auth_user_id_key" ON "user_profiles"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_username_key" ON "user_profiles"("username");

-- CreateIndex
CREATE INDEX "user_profiles_auth_user_id_idx" ON "user_profiles"("auth_user_id");

-- CreateIndex
CREATE INDEX "user_profiles_username_idx" ON "user_profiles"("username");

-- CreateIndex
CREATE INDEX "user_profiles_status_idx" ON "user_profiles"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE INDEX "user_friends_requester_id_idx" ON "user_friends"("requester_id");

-- CreateIndex
CREATE INDEX "user_friends_receiver_id_idx" ON "user_friends"("receiver_id");

-- CreateIndex
CREATE INDEX "user_friends_status_idx" ON "user_friends"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_friends_requester_id_receiver_id_key" ON "user_friends"("requester_id", "receiver_id");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
