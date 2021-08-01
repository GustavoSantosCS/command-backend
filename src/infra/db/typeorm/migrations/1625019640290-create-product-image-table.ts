import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from 'typeorm'

export class CreateProductImageTable1625019640290
  implements MigrationInterface
{
  tableName = 'product_image'
  fatherTableName = 'products'
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
        name: 'image_product_fk' // Nome da ForeignKey
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const fatherTable = await queryRunner.getTable(this.fatherTableName)
    const foreignKey = fatherTable.foreignKeys.find(fk =>
      fk.columnNames.includes('image_product_fk')
    )
    await queryRunner.dropForeignKey(this.fatherTableName, foreignKey)
    await queryRunner.dropColumn(this.fatherTableName, 'image')
    await queryRunner.dropTable(this.tableName)
  }
}
