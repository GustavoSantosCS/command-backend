import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from 'typeorm';

export class CreatePlaylistMusicTable1625200947671
  implements MigrationInterface
{
  tableName = 'playlist_music';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'idPlaylist', type: 'uuid' },
          { name: 'idMusic', type: 'uuid' },
          { name: 'position', type: 'int' },
          { name: 'isPlay', type: 'boolean' }
        ],
        foreignKeys: [
          {
            columnNames: ['idPlaylist'],
            referencedColumnNames: ['id'],
            referencedTableName: 'playlists',
            name: 'playlists_music_fk'
          },
          {
            columnNames: ['idMusic'],
            referencedColumnNames: ['id'],
            referencedTableName: 'musics',
            name: 'music_playlists_fk'
          }
        ]
      })
    );

    await queryRunner.addColumn(
      'playlists',
      new TableColumn({
        name: 'current_music_id',
        type: 'uuid',
        isNullable: true
      })
    );

    await queryRunner.createForeignKey(
      'playlists',
      new TableForeignKey({
        columnNames: ['current_music_id'],
        referencedTableName: 'playlist_music',
        referencedColumnNames: ['id'],
        name: 'current_music_playlist_fk'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName);

    // Remove Chave Estrangeria 1
    const foreignKey1 = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('playlist_music_fk') !== -1
    );
    // Remove Chave Estrangeria 2
    const foreignKey2 = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('music_playlist_fk') !== -1
    );

    // Remove Chave Estrangeria 2
    const foreignKey3 = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('current_music_playlist_fk') !== -1
    );
    await queryRunner.dropForeignKeys(this.tableName, [
      foreignKey1,
      foreignKey2,
      foreignKey3
    ]);
    await queryRunner.dropColumn('playlists', 'current_music_id');

    await queryRunner.dropTable(this.tableName);
  }
}
