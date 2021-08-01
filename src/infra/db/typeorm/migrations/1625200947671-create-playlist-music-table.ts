import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from 'typeorm'

export class CreatePlaylistMusicTable1625200947671
  implements MigrationInterface
{
  tableName = 'playlist_music'
  fatherTableName = 'playlists'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'playlist_id', type: 'uuid' },
          { name: 'music_id', type: 'uuid' },
          { name: 'position', type: 'int' },
          { name: 'isPlay', type: 'boolean' }
        ],
        foreignKeys: [
          {
            columnNames: ['playlist_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'playlists',
            name: 'playlist_music_playlists_fk'
          },
          {
            columnNames: ['music_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'musics',
            name: 'playlist_music_music_fk'
          }
        ]
      }),
      false
    )

    await queryRunner.addColumn(
      this.fatherTableName,
      new TableColumn({
        name: 'current_music_id',
        type: 'uuid',
        isNullable: true
      })
    )

    await queryRunner.createForeignKey(
      this.fatherTableName,
      new TableForeignKey({
        columnNames: ['current_music_id'],
        referencedTableName: this.tableName,
        referencedColumnNames: ['id'],
        name: 'playlist_current_music_fk'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName)
    const fatherTable = await queryRunner.getTable(this.fatherTableName)

    const foreignKey1 = table.foreignKeys.find(fk =>
      fk.columnNames.includes('playlist_music_playlists_fk')
    )

    const foreignKey2 = table.foreignKeys.find(fk =>
      fk.columnNames.includes('playlist_music_music_fk')
    )

    const foreignKey3 = fatherTable.foreignKeys.find(fk =>
      fk.columnNames.includes('playlist_current_music_fk')
    )

    await queryRunner.dropForeignKeys(this.tableName, [
      foreignKey1,
      foreignKey2
    ])

    await queryRunner.dropForeignKey(this.fatherTableName, foreignKey3)

    await queryRunner.dropColumn(this.fatherTableName, 'current_music_id')
    await queryRunner.dropTable(this.tableName)
  }
}
