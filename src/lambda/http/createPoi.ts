import 'source-map-support/register'

import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreatePoiRequest } from '../../requests/CreatePoiRequest'
import { createPoi } from '../../businessLogic/poi'

import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('createPoi')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('creating poi', event.body)

  const newpoi: CreatePoiRequest = JSON.parse(event.body)
  const userId: string = getUserId(event)
  const createdItem = await createPoi(newpoi, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: createdItem
    })
  }
})

handler.use(cors())
