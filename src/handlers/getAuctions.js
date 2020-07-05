import AWS from "aws-sdk";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import eventNormalizer from "@middy/http-event-normalizer";
import errorHandler from "@middy/http-error-handler";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;

  try {
    const result = await dynamodb
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME,
      })
      .promise();

    auctions = result.Items;
  } catch (err) {
    console.error(err);
    throw new createError.InternalServerError(err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = middy(getAuctions)
  .use(bodyParser())
  .use(eventNormalizer())
  .use(errorHandler());
