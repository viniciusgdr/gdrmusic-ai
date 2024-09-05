-- CreateEnum
CREATE TYPE "PlaylistType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('ROCK', 'POP', 'MPB', 'FUNK', 'RAP', 'SERTANEJO', 'PAGODE', 'AXE', 'FORRO', 'ELETRONICA', 'CLASSICA', 'JAZZ', 'BLUES', 'REGGAE', 'COUNTRY', 'INFANTIL', 'OUTROS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "thumbnail" TEXT NOT NULL DEFAULT '',
    "user_id" TEXT NOT NULL,
    "type" "PlaylistType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistMusic" (
    "id" TEXT NOT NULL,
    "playlist_id" TEXT NOT NULL,
    "music_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaylistMusic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Music" (
    "id" TEXT NOT NULL,
    "partner_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "genre" "Genre" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Music_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistMusic" ADD CONSTRAINT "PlaylistMusic_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistMusic" ADD CONSTRAINT "PlaylistMusic_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "Music"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
