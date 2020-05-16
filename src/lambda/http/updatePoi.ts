import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdatePoiRequest } from '../../requests/UpdatePoiRequest'
import { updatePoi } from '../../businessLogic/poi';
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'

const logger = createLogger('updatePoi')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('updating todo', event.body)

  const poiId = event.pathParameters.poiId
  const updatedPoi: UpdatePoiRequest = JSON.parse(event.body)
  const userId: string = getUserId(event)

  await updatePoi(userId, poiId, updatedPoi)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
})

handler.use(cors())
