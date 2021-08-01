import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreatePlaylistTable1625200448321 implements MigrationInterface {
  tableName = 'playlists'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'name', type: 'varchar' },
          { name: 'isActive', type: 'boolean' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
          { name: 'establishment_id', type: 'uuid' }
        ],
        foreignKeys: [
          {
            columnNames: ['establishment_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'establishments',
            name: 'playlist_establishment_fk' // Nome da ForeignKey
          }
        ]
      }),
      false
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName)
    const foreignKey = table.foreignKeys.find(fk =>
      fk.columnNames.includes('playlist_establishment_fk')
    )
    await queryRunner.dropForeignKey(this.tableName, foreignKey)
    await queryRunner.dropTable(this.tableName)
  }
}
