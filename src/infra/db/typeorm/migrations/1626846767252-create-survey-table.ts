import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSurveyTable1626846767252 implements MigrationInterface {
  tableName = 'surveys';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'question', type: 'varchar' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
          { name: 'closed_at', type: 'timestamp', isNullable: true },
          { name: 'establishment_id', type: 'uuid' }
        ],
        foreignKeys: [
          {
            columnNames: ['establishment_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'establishments',
            name: 'establishment_survey_fk'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName);
    // Remove Chave Estrangeria 1
    const foreignKey1 = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('establishment_survey_fk') !== -1
    );
    await queryRunner.dropForeignKey(this.tableName, foreignKey1);
    await queryRunner.dropTable(this.tableName);
  }
}
