import 'source-map-support/register'

import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getCityPoi } from '../../businessLogic/poi'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('getPoi')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Getting city poi', event.body)

    const poi = await getCityPoi(event.pathParameters.city)

    return {
        statusCode: 200,
        body: JSON.stringify({
            items: poi
        })
    }
})

handler.use(cors())
