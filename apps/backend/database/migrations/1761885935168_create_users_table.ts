import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Adapts the existing Players table for AdonisJS auth:
 * - Removes legacy SenhaHash / SenhaSalt columns
 * - Adds standard password column (bcrypt, managed by AdonisJS)
 */
export default class extends BaseSchema {
  async up() {
    await this.db.rawQuery(`ALTER TABLE "Players" DROP COLUMN IF EXISTS "SenhaHash"`)
    await this.db.rawQuery(`ALTER TABLE "Players" DROP COLUMN IF EXISTS "SenhaSalt"`)
    await this.db.rawQuery(
      `ALTER TABLE "Players" ADD COLUMN IF NOT EXISTS "password" VARCHAR(255) NOT NULL DEFAULT ''`
    )
  }

  async down() {
    await this.db.rawQuery(`ALTER TABLE "Players" DROP COLUMN IF EXISTS "password"`)
    await this.db.rawQuery(`ALTER TABLE "Players" ADD COLUMN IF NOT EXISTS "SenhaHash" BYTEA NOT NULL DEFAULT ''`)
    await this.db.rawQuery(`ALTER TABLE "Players" ADD COLUMN IF NOT EXISTS "SenhaSalt" BYTEA NOT NULL DEFAULT ''`)
  }
}
