//@ts-nocheck
const AWS = require("aws-sdk");

var TableName = process.env.TABLE_NAME;
var region = process.env.AWS_REGION;
AWS.config.update({ region: region });

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event: any, context: any, callback: any) => {
  const data = JSON.parse(event.body);
  const task = data.task;
  const id = data.id || `${Date.now()}`;
  const done = data.done || false;
  const Item = {
    id,
    task,
    done,
  };

  dynamo.put({ TableName, Item }, function (err: any, data: any) {
    console.log(event);
    if (err) {
      console.log("error", err);
      callback(err, null);
    } else {
      var response = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Origin": "*",
        },
        isBase64Encoded: false,
        body: JSON.stringify(Item),
      };
      console.log("success: returned ${data.Item}");
      callback(null, response);
    }
  });
};
