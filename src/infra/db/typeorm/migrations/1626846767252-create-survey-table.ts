import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateSurveyTable1626846767252 implements MigrationInterface {
  tableName = 'surveys'
  fatherTableName = 'establishments'
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
            referencedTableName: this.fatherTableName,
            name: 'survey_establishment_fk'
          }
        ]
      }),
      false
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName)
    const foreignKey1 = table.foreignKeys.find(fk =>
      fk.columnNames.includes('survey_establishment_fk')
    )
    await queryRunner.dropForeignKey(this.tableName, foreignKey1)
    await queryRunner.dropTable(this.tableName)
  }
}
