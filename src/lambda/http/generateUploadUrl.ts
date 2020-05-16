import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { generateUploadUrl } from '../../businessLogic/poi'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'

const logger = createLogger('generateUploadUrl')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('generating upload url', event.body)

  const poiId = event.pathParameters.poiId
  const userId: string = getUserId(event)

  const uploadUrl = await generateUploadUrl(userId, poiId)

  return {
    statusCode: 200,
    body: JSON.stringify({ uploadUrl })
  }
})

handler.use(cors())
