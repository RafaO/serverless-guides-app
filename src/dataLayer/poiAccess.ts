import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { PoiItem } from '../models/PoiItem'
import { UpdatePoiRequest } from '../requests/UpdatePoiRequest';
import { createLogger } from '../utils/logger';

const logger = createLogger('PoiAccess')

export class PoiAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly userIdIndex = process.env.USER_ID_INDEX,
        private readonly poiTable = process.env.POI_TABLE,
        private readonly bucketName = process.env.IMAGES_S3_BUCKET) {
    }

    async getAllPoi(userId: string): Promise<PoiItem[]> {
        const result = await this.docClient.query({
            TableName: this.poiTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as PoiItem[]
    }

    async createPoi(poi: PoiItem): Promise<PoiItem> {
        await this.docClient.put({
            TableName: this.poiTable,
            Item: poi
        }).promise()

        return poi
    }

    async updatePoi(userId: string, poiId: string, poi: UpdatePoiRequest): Promise<PoiItem> {
        const { name } = poi
        const newValue = await this.docClient.update({
            TableName: this.poiTable,
            Key: { poiId, userId },
            UpdateExpression: 'set #poiName=:name',
            ExpressionAttributeNames: { '#poiName': 'name' },
            ExpressionAttributeValues: {
                ':name': name
            },
            ReturnValues: "ALL_NEW"
        }).promise()

        logger.log('info', 'poi updated')

        return newValue.Attributes as PoiItem
    }

    async createImage(userId: string, poiId: string) {
        await this.docClient.update({
            TableName: this.poiTable,
            Key: { userId, poiId },
            UpdateExpression: 'set attachmentUrl=:attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': `https://${this.bucketName}.s3.amazonaws.com/${poiId}`
            }
        }).promise()
    }

    async deletePoi(userId: string, poiId: string): Promise<PoiItem> {
        const deletedItem = await this.docClient.delete({
            TableName: this.poiTable,
            Key: { poiId, userId },
            ReturnValues: "ALL_OLD"
        }).promise()

        return deletedItem.Attributes as PoiItem
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}
