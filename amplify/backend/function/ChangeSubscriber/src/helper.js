const AWS = require("aws-sdk");

// const shortid = require('shortid');

const logEvent = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  try {
    if (event.ActionType) event.ActionType = parseInt(event.ActionType);
    if (event.jobid) event.jobid = parseInt(event.jobid);
    if (event.loadid) event.loadid = parseInt(event.loadid);
    if (event.Driver) event.Driver = parseInt(event.Driver);
    const params = {
      TableName: process.env.STORAGE_PDEVENTS_NAME, // get the table name from the automatically populated environment variables
      Item: {
        id: `${new Date().toISOString()}`,
        waqt: `${new Date().toISOString()}`,
        ...event,
      },
      ConditionExpression: "attribute_not_exists(id)", // do not overwrite existing entries
      ReturnConsumedCapacity: "TOTAL",
    };

    console.log("params: ", params);
    const er = await dynamodb.put(params).promise();
    console.log("success -log: ", er);
  } catch (e) {
    console.log("Error updating event log: ", e);
  }
};

const deleteForever = async (props) => {
  var dynamodb = new AWS.DynamoDB();
  const params = {
    Key: {
      id: {
        S: props.id,
      },
      cat: {
        S: props.cat,
      },
    },

    TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
  };
  const result = await dynamodb.deleteItem(params).promise();
  console.log("deleting item...", result);

  return result;
};

module.exports = {
  logEvent,
  deleteForever,
};
