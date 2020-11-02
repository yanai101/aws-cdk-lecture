// @ts-nocheck
const AWS = require("aws-sdk");

var TableName = process.env.TABLE_NAME;
var region = process.env.AWS_REGION;
AWS.config.update({ region: region });

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: any, context: any, callback: any) => {
  try {
    const data = await dynamo.scan({ TableName: TableName }).promise();
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data.Items),
      isBase64Encoded: false,
    };
    callback(null, response);
  } catch (error) {
    callback(error, null);
  }
};
