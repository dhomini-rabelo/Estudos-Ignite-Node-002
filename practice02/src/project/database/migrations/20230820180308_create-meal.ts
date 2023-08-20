import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.boolean('is_in_the_diet').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.uuid('user_id').index().notNullable()
    table.foreign('user_id').references('users.id').deferrable('deferred')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meals')
}
