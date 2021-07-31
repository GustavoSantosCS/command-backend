import { MigrationInterface, QueryRunner, Table } from 'typeorm'

/**
 * Criar a Tabela
 * Criar as foreignKey product e account
 */
export class CreateRequestProduct1625813513294 implements MigrationInterface {
  tableName = 'requests_product'
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'account_id', type: 'uuid' },
          { name: 'product_id', type: 'uuid' },
          { name: 'amount_of_product', type: 'int' },
          { name: 'total', type: 'decimal', precision: 5, scale: 2 },
          { name: 'obs', type: 'varchar', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
          { name: 'closed_at', type: 'timestamp', isNullable: true }
        ],
        foreignKeys: [
          {
            columnNames: ['account_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'accounts',
            name: 'requests-product_account_fk' // Nome da ForeignKey
          },
          {
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            name: 'requests-product_product_fk' // Nome da ForeignKey
          }
        ]
      })
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName)
    // Remove Chave Estrangeria 1
    const foreignKey1 = table.foreignKeys.find(
      fk => fk.columnNames.includes('requests-product_account_fk')
    )
    // Remove Chave Estrangeria 2
    const foreignKey2 = table.foreignKeys.find(
      fk => fk.columnNames.includes('requests-product_product_fk')
    )
    await queryRunner.dropForeignKeys(this.tableName, [
      foreignKey1,
      foreignKey2
    ])

    await queryRunner.dropTable(this.tableName)
  }
}
