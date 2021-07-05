import { MigrationInterface, QueryRunner, Table } from 'typeorm';

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
          { name: 'alreadyTouched', type: 'boolean' },
          { name: 'isPlay', type: 'boolean' }
        ],
        foreignKeys: [
          {
            columnNames: ['idPlaylist'],
            referencedColumnNames: ['id'],
            referencedTableName: 'playlists',
            name: 'playlists_music_fk',
            onDelete: 'CASCADE'
          },
          {
            columnNames: ['idMusic'],
            referencedColumnNames: ['id'],
            referencedTableName: 'musics',
            name: 'music_playlists_fk',
            onDelete: 'CASCADE'
          }
        ]
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
    await queryRunner.dropForeignKeys(this.tableName, [
      foreignKey1,
      foreignKey2
    ]);

    await queryRunner.dropTable(this.tableName);
  }
}
