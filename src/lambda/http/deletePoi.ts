import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { deletePoi } from '../../businessLogic/poi';
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'

const logger = createLogger('deletePoi')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('deletePoi')

    const poiId = event.pathParameters.poiId
    const userId = getUserId(event)

    await deletePoi(userId, poiId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  })

handler.use(cors())
