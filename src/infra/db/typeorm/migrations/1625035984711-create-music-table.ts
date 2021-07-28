import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from 'typeorm';

export class CreateMusicTable1625035984711 implements MigrationInterface {
  tableName = 'musics';
  fatherTableName = 'establishments';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'name', type: 'varchar' },
          { name: 'talent', type: 'varchar' },
          { name: 'duration', type: 'int' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
          { name: 'establishment_id', type: 'uuid' }
        ],
        foreignKeys: [
          {
            columnNames: ['establishment_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'establishments',
            name: 'establishment_playlist_fk' // Nome da ForeignKey
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.fatherTableName);
    const foreignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('establishment_music_fk') !== -1
    );
    await queryRunner.dropForeignKey(this.fatherTableName, foreignKey);
    await queryRunner.dropTable(this.tableName);
  }
}
