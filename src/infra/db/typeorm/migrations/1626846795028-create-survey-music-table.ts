import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateMusicTable1626846779793 implements MigrationInterface {
  tableName = 'survey_music'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'survey_id', type: 'uuid' },
          { name: 'music_id', type: 'uuid' },
          { name: 'position', type: 'int' }
        ],
        foreignKeys: [
          {
            columnNames: ['survey_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'surveys',
            name: 'survey_music_survey_fk'
          },
          {
            columnNames: ['music_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'musics',
            name: 'survey_music_music_fk'
          }
        ]
      }),
      false
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName)

    const foreignKey1 = table.foreignKeys.find(fk =>
      fk.columnNames.includes('survey_music_survey_fk')
    )

    const foreignKey2 = table.foreignKeys.find(fk =>
      fk.columnNames.includes('survey_music_music_fk')
    )

    await queryRunner.dropForeignKeys(this.tableName, [
      foreignKey1,
      foreignKey2
    ])

    await queryRunner.dropTable(this.tableName)
  }
}
