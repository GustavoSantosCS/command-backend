import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createVoteTable1627521715029 implements MigrationInterface {
  tableName = 'votes'
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'music_id', type: 'uuid' },
          { name: 'survey_id', type: 'uuid' },
          { name: 'client_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamp', default: 'now()' }
        ],
        foreignKeys: [
          {
            columnNames: ['survey_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'surveys',
            name: 'votes_survey_fk'
          },
          {
            columnNames: ['music_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'musics',
            name: 'votes_music_fk'
          },
          {
            columnNames: ['client_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            name: 'votes_user_fk'
          }
        ]
      })
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName)

    // Remove Chave Estrangeria 1
    const foreignKey1 = table.foreignKeys.find(
      fk => fk.columnNames.includes('votes_survey_fk')
    )
    // Remove Chave Estrangeria 2
    const foreignKey2 = table.foreignKeys.find(
      fk => fk.columnNames.includes('votes_music_fk')
    )
    // Remove Chave Estrangeria 3
    const foreignKey3 = table.foreignKeys.find(
      fk => fk.columnNames.includes('votes_user_fk')
    )

    await queryRunner.dropForeignKeys(this.tableName, [
      foreignKey1,
      foreignKey2,
      foreignKey3
    ])

    await queryRunner.dropTable(this.tableName)
  }
}
