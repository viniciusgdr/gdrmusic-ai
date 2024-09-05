-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Genre" ADD VALUE 'HIPHOP';
ALTER TYPE "Genre" ADD VALUE 'SAMBA';
ALTER TYPE "Genre" ADD VALUE 'GOSPEL';
ALTER TYPE "Genre" ADD VALUE 'METAL';
ALTER TYPE "Genre" ADD VALUE 'INDIE';
ALTER TYPE "Genre" ADD VALUE 'ALTERNATIVO';
ALTER TYPE "Genre" ADD VALUE 'BOSSA_NOVA';
ALTER TYPE "Genre" ADD VALUE 'SOUL';
ALTER TYPE "Genre" ADD VALUE 'RHYTHM_AND_BLUES';
ALTER TYPE "Genre" ADD VALUE 'FOLK';
ALTER TYPE "Genre" ADD VALUE 'PUNK';
ALTER TYPE "Genre" ADD VALUE 'GOTICO';
ALTER TYPE "Genre" ADD VALUE 'HARDCORE';
ALTER TYPE "Genre" ADD VALUE 'GRUNGE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "genresLiked" "Genre"[];
