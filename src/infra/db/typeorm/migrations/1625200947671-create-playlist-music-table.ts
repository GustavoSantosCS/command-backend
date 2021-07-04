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
          { name: 'idPlaylist', type: 'uuid', isPrimary: true },
          { name: 'idMusic', type: 'uuid', isPrimary: true }
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
