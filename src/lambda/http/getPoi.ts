import 'source-map-support/register'

import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAllPoi } from '../../businessLogic/poi'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'

const logger = createLogger('getPoi')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Getting all poi', event.body)

  const userId: string = getUserId(event)
  const poi = await getAllPoi(userId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: poi
    })
  }
})

handler.use(cors())
