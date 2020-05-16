# Serverless Guides App

Project developed as a show case of serverless architecture for the udacity cloud developer nano degree.

# Functionality of the application

This application implements OAuth authentication and allows users to add Points of Interest (POI) to the system. These POI can also have an attached image.

The application will allow each user to see the POI he/she chreated, delete them and update them. It also allows users to attach an image to an existing POI he/she created.

Additionally, users will also be able to get the POI from an specific city. Which required an extra index in the DB.

# Points of interests

The application stores POI items, and each POI consists of the following items:

* `city` (string) - the city where the POI is
* `poiId` (number) - the id of the POI
* `name` (string) - name that will be displayed for this POI
* `userId` (string) - id of the user that created this POI
* `imageUrl` (string) (optional) - a URL pointing to an image of the POI

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Test the application

Once deployed, you can play around with the application using the attached postman collection. You will need an auth token since the endpoints require authentication.
