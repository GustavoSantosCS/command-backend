import 'reflect-metadata'
import 'module-alias/register'
import { TypeORMHelpers } from '@/infra/db/typeorm'

TypeORMHelpers.connect()
  .then(async () => {
    const { env } = await import('@/shared/config')
    const app = (await import('@/main/config/app')).default

    app.listen(env.app.port, () => {
      console.clear()
      console.log('\nBackend Online')
      env.app.env !== 'production' &&
        console.log(
          `Click para acessar: ${env.app.protocol}://${env.app.host}:${env.app.port}\n`
        )
    })
  })
  .catch(async error => {
    console.error('Can not connect into database')
    console.error(error)
  })
