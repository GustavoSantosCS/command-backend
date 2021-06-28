import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from 'typeorm';

export class CreateEstablishmentImage1624885207494
  implements MigrationInterface
{
  tableName = 'establishment_image';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'persistentName',
            type: 'varchar',
            isPrimary: true
          },
          {
            name: 'originalName',
            type: 'varchar'
          },
          {
            name: 'target',
            type: 'varchar'
          }
        ]
      }),
      true
    );

    await queryRunner.addColumn(
      'establishments',
      new TableColumn({ name: 'image', type: 'varchar' })
    );

    await queryRunner.createForeignKey(
      'establishments', // Tabela pai
      new TableForeignKey({
        columnNames: ['image'], // Coluna pai da Tabela pai
        referencedTableName: this.tableName, // Tabela referenciada
        referencedColumnNames: ['persistentName'], // Coluna referenciada
        name: 'establishment_image_fk', // Nome da ForeignKey
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('establishments');
    const foreignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('image') !== -1
    );
    await queryRunner.dropForeignKey('establishments', foreignKey);
    await queryRunner.dropColumn('establishments', 'image');
    await queryRunner.dropTable('establishment_image');
  }
}
