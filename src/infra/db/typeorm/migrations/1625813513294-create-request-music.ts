import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * Criar a Tabela
 * Criar as foreignKey product e account
 */
export class CreateRequestMusic1625813513694 implements MigrationInterface {
  tableName = 'requests_music';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'account_id', type: 'uuid' },
          { name: 'music_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamp', default: 'now()' }
        ],
        foreignKeys: [
          {
            columnNames: ['account_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'accounts',
            name: 'requests-product_account_fk', // Nome da ForeignKey
            onDelete: 'CASCADE'
          },
          {
            columnNames: ['music_id'],
            referencedTableName: 'musics',
            referencedColumnNames: ['id'],
            name: 'requests-music_music_fk', // Nome da ForeignKey
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
      fk => fk.columnNames.indexOf('requests-music_account_fk') !== -1
    );
    // Remove Chave Estrangeria 2
    const foreignKey2 = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('requests-music_music_fk') !== -1
    );
    await queryRunner.dropForeignKeys(this.tableName, [
      foreignKey1,
      foreignKey2
    ]);

    await queryRunner.dropTable(this.tableName);
  }
}
