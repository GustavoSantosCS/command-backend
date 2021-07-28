import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from 'typeorm';

export class CreateAvatarTable1623267125585 implements MigrationInterface {
  tableName = 'avatars';
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
      true
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'avatar',
        type: 'varchar',
        isNullable: true
      })
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['avatar'],
        referencedColumnNames: ['persistentName'],
        referencedTableName: 'avatars',
        name: 'user_avatar_fk'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    const foreignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('avatar') !== -1
    );
    await queryRunner.dropForeignKey('users', foreignKey);
    await queryRunner.dropColumn('users', 'avatar');
    await queryRunner.dropTable('avatars');
  }
}
