import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateMusicTable1625035984711 implements MigrationInterface {
  tableName = 'musics'
  fatherTableName = 'establishments'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'name', type: 'varchar' },
          { name: 'talent', type: 'varchar' },
          { name: 'duration', type: 'int' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
          { name: 'establishment_id', type: 'uuid' }
        ],
        foreignKeys: [
          {
            columnNames: ['establishment_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'establishments',
            name: 'music_establishment_fk' // Nome da ForeignKey
          }
        ]
      }),
      false
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const fatherTable = await queryRunner.getTable(this.fatherTableName)
    const foreignKey = fatherTable.foreignKeys.find(fk =>
      fk.columnNames.includes('music_establishment_fk')
    )
    await queryRunner.dropForeignKey(this.fatherTableName, foreignKey)
    await queryRunner.dropTable(this.tableName)
  }
}
