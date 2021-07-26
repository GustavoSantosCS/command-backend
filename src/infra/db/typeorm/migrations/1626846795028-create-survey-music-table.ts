import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMusicTable1626846779793 implements MigrationInterface {
  tableName = 'survey_music';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'idSurvey', type: 'uuid' },
          { name: 'idMusic', type: 'uuid' },
          { name: 'position', type: 'int' }
        ],
        foreignKeys: [
          {
            columnNames: ['idSurvey'],
            referencedColumnNames: ['id'],
            referencedTableName: 'surveys',
            name: 'survey_music_fk',
            onDelete: 'CASCADE'
          },
          {
            columnNames: ['idMusic'],
            referencedColumnNames: ['id'],
            referencedTableName: 'musics',
            name: 'music_survey_fk',
            onDelete: 'CASCADE'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName);

    // Remove Chave Estrangeria 1
    const foreignKey1 = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('survey_music_fk') !== -1
    );
    // Remove Chave Estrangeria 2
    const foreignKey2 = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('music_survey_fk') !== -1
    );
    await queryRunner.dropForeignKeys(this.tableName, [
      foreignKey1,
      foreignKey2
    ]);

    await queryRunner.dropTable(this.tableName);
  }
}
