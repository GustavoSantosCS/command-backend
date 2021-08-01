import { MigrationInterface, QueryRunner, Table } from 'typeorm'

/**
 * Criar a Tabela
 * Criar as foreignKey product e account
 */
export class CreateRequestMusic1625813513694 implements MigrationInterface {
  tableName = 'requests_music'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'account_id', type: 'uuid' },
          { name: 'music_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamp', default: 'now()' }
        ],
        foreignKeys: [
          {
            columnNames: ['account_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'accounts',
            name: 'requests_music_account_fk' // Nome da ForeignKey
          },
          {
            columnNames: ['music_id'],
            referencedTableName: 'musics',
            referencedColumnNames: ['id'],
            name: 'requests_music_music_fk' // Nome da ForeignKey
          }
        ]
      }),
      false
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName)

    const foreignKey1 = table.foreignKeys.find(fk =>
      fk.columnNames.includes('requests_music_account_fk')
    )

    const foreignKey2 = table.foreignKeys.find(fk =>
      fk.columnNames.includes('requests_music_music_fk')
    )

    await queryRunner.dropForeignKeys(this.tableName, [
      foreignKey1,
      foreignKey2
    ])

    await queryRunner.dropTable(this.tableName)
  }
}
