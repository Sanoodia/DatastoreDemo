// This function will sync all zones in dynamodb with elasticsearch cluster.
// Running this function will update version property of each zone.

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

const getZonesQuery = {
  KeyConditionExpression: "cat = :cs",
  IndexName: "byCategory",
  FilterExpression: "attribute_not_exists(#deleted)",
  ExpressionAttributeValues: {
    ":cs": "ZONE",
  },
  ExpressionAttributeNames: { "#deleted": "_deleted" },
  TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
};

const updateItem = (data) => {
  return {
    Key: {
      id: data.id,
      cat: data.cat,
    },
    UpdateExpression: "set #version = :val1",
    ExpressionAttributeValues: {
      ":val1": ++data._version,
    },
    ExpressionAttributeNames: { "#version": "_version" },

    ReturnValues: "ALL_NEW",
    TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
  };
};

exports.handler = async (event) => {
  const zones = await dynamodb.query(getZonesQuery).promise();
  const updatedZones = zones.Items.map(
    async (zone) => await dynamodb.update(updateItem(zone)).promise()
  );
  return Promise.all(updatedZones).then(async (response) => ({
    statusCode: 200,
    body: JSON.stringify({ response: response }),
  }));
};
