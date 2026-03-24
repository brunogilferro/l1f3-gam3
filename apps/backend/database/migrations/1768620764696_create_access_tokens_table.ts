import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    await this.db.rawQuery(`
      CREATE TABLE IF NOT EXISTS "auth_access_tokens" (
        "id" SERIAL PRIMARY KEY,
        "tokenable_id" BIGINT NOT NULL,
        "type" VARCHAR(255) NOT NULL,
        "name" VARCHAR(255) NULL,
        "hash" VARCHAR(255) NOT NULL,
        "abilities" TEXT NOT NULL,
        "created_at" TIMESTAMP NULL,
        "updated_at" TIMESTAMP NULL,
        "last_used_at" TIMESTAMP NULL,
        "expires_at" TIMESTAMP NULL,
        CONSTRAINT "fk_auth_tokens_player"
          FOREIGN KEY ("tokenable_id")
          REFERENCES "Players"("CodigoPlayer")
          ON DELETE CASCADE
      )
    `)
  }

  async down() {
    await this.db.rawQuery(`DROP TABLE IF EXISTS "auth_access_tokens"`)
  }
}
