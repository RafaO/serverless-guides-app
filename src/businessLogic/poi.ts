import * as uuid from 'uuid'

import { PoiItem } from '../models/PoiItem'
import { PoiAccess } from '../dataLayer/poiAccess'
import { CreatePoiRequest } from '../requests/CreatePoiRequest'
import { UpdatePoiRequest } from '../requests/UpdatePoiRequest'

import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

const poiAccess = new PoiAccess()

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = +process.env.SIGNED_URL_EXPIRATION

const s3 = new XAWS.S3({ signatureVersion: 'v4' })

export async function getAllPoi(userId: string): Promise<PoiItem[]> {
    return poiAccess.getAllPoi(userId)
}

export async function getCityPoi(city: string): Promise<PoiItem[]> {
    return poiAccess.getCityPoi(city)
}

export async function createPoi(
    CreatePoiRequest: CreatePoiRequest,
    userId: string
): Promise<PoiItem> {

    const itemId = uuid.v4()

    return await poiAccess.createPoi({
        poiId: itemId,
        userId,
        name: CreatePoiRequest.name,
        city: CreatePoiRequest.city
    })
}

export async function updatePoi(userId: string, poiId: string, UpdatePoiRequest: UpdatePoiRequest): Promise<PoiItem> {
    return await poiAccess.updatePoi(userId, poiId, UpdatePoiRequest)
}

export async function deletePoi(userId: string, poiId: string): Promise<PoiItem> {
    return await poiAccess.deletePoi(userId, poiId)
}

export async function generateUploadUrl(userId: string, poiId: string): Promise<string> {
    await poiAccess.createImage(userId, poiId);
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: poiId,
        Expires: urlExpiration
    })
}
