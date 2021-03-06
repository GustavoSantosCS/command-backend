import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from 'typeorm'

export class CreateAvatarTable1623267125585 implements MigrationInterface {
  tableName = 'avatars'
  fatherTableName = 'users'
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
      new TableColumn({
        name: 'avatar',
        type: 'varchar',
        isNullable: true
      })
    )

    await queryRunner.createForeignKey(
      this.fatherTableName,
      new TableForeignKey({
        columnNames: ['avatar'],
        referencedColumnNames: ['persistentName'],
        referencedTableName: 'avatars',
        name: 'avatar_user_fk'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const fatherTable = await queryRunner.getTable(this.fatherTableName)
    const foreignKey = fatherTable.foreignKeys.find(fk =>
      fk.columnNames.includes('avatar_user_fk')
    )
    await queryRunner.dropForeignKey(this.fatherTableName, foreignKey)
    await queryRunner.dropColumn(this.fatherTableName, 'avatar')
    await queryRunner.dropTable('avatars')
  }
}
