import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from 'typeorm';

export class CreateEstablishmentTable1624885040938
  implements MigrationInterface
{
  tableName = 'establishments';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'name', type: 'varchar' },
          { name: 'category', type: 'varchar' },
          { name: 'description', type: 'varchar' },
          { name: 'isOpen', type: 'boolean' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
          { name: 'delete_at', type: 'timestamp', isNullable: true }
        ]
      }),
      true
    );

    await queryRunner.addColumn(
      this.tableName,
      new TableColumn({ name: 'manager', type: 'uuid' })
    );

    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['manager'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        name: 'establishments_user_fk'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName);
    const foreignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('manager') !== -1
    );
    await queryRunner.dropForeignKey(this.tableName, foreignKey);
    await queryRunner.dropColumn(this.tableName, 'manager');
    await queryRunner.dropTable(this.tableName);
  }
}
