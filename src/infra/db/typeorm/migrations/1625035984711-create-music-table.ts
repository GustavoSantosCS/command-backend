import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from 'typeorm';

export class createMusicTable1625035984711 implements MigrationInterface {
  tableName = 'musics';
  fatherTableName = 'establishments';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'name', type: 'varchar' },
          { name: 'talent_name', type: 'varchar' },
          { name: 'duration', type: 'int' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
          { name: 'establishment_id', type: 'uuid' }
        ]
      })
    );
    await queryRunner.createForeignKey(
      this.tableName, // Tabela pai
      new TableForeignKey({
        columnNames: ['establishment_id'], // Coluna pai da Tabela pai
        referencedTableName: this.fatherTableName, // Tabela referenciada
        referencedColumnNames: ['id'], // Coluna referenciada
        name: 'establishment_music_fk', // Nome da ForeignKey
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.fatherTableName);
    const foreignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('establishment_id') !== -1
    );
    await queryRunner.dropForeignKey(this.fatherTableName, foreignKey);
    await queryRunner.dropTable(this.tableName);
  }
}
