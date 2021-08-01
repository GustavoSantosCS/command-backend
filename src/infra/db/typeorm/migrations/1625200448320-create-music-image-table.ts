import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from 'typeorm'

export class CreatedMusicImageTable1625200448320 implements MigrationInterface {
  tableName = 'music_image'
  fatherTableName = 'musics'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'persistentName', type: 'varchar', isPrimary: true },
          { name: 'originalName', type: 'varchar' },
          { name: 'target', type: 'varchar' }
        ]
      }),
      false
    )

    await queryRunner.addColumn(
      this.fatherTableName,
      new TableColumn({ name: 'image', type: 'varchar' })
    )

    await queryRunner.createForeignKey(
      this.fatherTableName, // Tabela pai
      new TableForeignKey({
        columnNames: ['image'], // Coluna pai da Tabela pai
        referencedTableName: this.tableName, // Tabela referenciada
        referencedColumnNames: ['persistentName'], // Coluna referenciada
        name: 'image_music_fk' // Nome da ForeignKey
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const fatherTable = await queryRunner.getTable(this.fatherTableName)
    const foreignKey = fatherTable.foreignKeys.find(fk =>
      fk.columnNames.includes('image_music_fk')
    )
    await queryRunner.dropForeignKey(this.fatherTableName, foreignKey)
    await queryRunner.dropColumn(this.fatherTableName, 'image')
    await queryRunner.dropTable(this.tableName)
  }
}
