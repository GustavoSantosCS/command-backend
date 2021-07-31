import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from 'typeorm'

export class CreatePlaylistMusicTable1625200947671
implements MigrationInterface {
  tableName = 'playlist_music'
  public async up (queryRunner: QueryRunner): Promise<void> {
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
            name: 'playlists_music_fk'
          },
          {
            columnNames: ['music_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'musics',
            name: 'music_playlists_fk'
          }
        ]
      })
    )

    await queryRunner.addColumn(
      'playlists',
      new TableColumn({
        name: 'current_music_id',
        type: 'uuid',
        isNullable: true
      })
    )

    await queryRunner.createForeignKey(
      'playlists',
      new TableForeignKey({
        columnNames: ['current_music_id'],
        referencedTableName: 'playlist_music',
        referencedColumnNames: ['id'],
        name: 'current_music_playlist_fk'
      })
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName)

    // Remove Chave Estrangeria 1
    const foreignKey1 = table.foreignKeys.find(
      fk => fk.columnNames.includes('playlist_music_fk')
    )
    // Remove Chave Estrangeria 2
    const foreignKey2 = table.foreignKeys.find(
      fk => fk.columnNames.includes('music_playlist_fk')
    )

    // Remove Chave Estrangeria 2
    const foreignKey3 = table.foreignKeys.find(
      fk => fk.columnNames.includes('current_music_playlist_fk')
    )
    await queryRunner.dropForeignKeys(this.tableName, [
      foreignKey1,
      foreignKey2,
      foreignKey3
    ])
    await queryRunner.dropColumn('playlists', 'current_music_id')

    await queryRunner.dropTable(this.tableName)
  }
}
