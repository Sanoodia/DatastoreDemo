const AWS = require("aws-sdk");

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
const getTargetsQuery = {
  KeyConditionExpression: "classification = :cs",
  IndexName: "byClass",
  FilterExpression: "attribute_not_exists(#deleted)",
  ExpressionAttributeValues: {
    ":cs": "TARGET",
  },
  ExpressionAttributeNames: { "#deleted": "_deleted" },
  TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
};
const getJobsQuery = {
  KeyConditionExpression: "cat = :cs",
  IndexName: "byCategory",
  FilterExpression:
    "attribute_not_exists(#deleted) AND (#bsId = :val OR #bsId = :val2)",
  ExpressionAttributeValues: {
    ":cs": "JOB",
    ":val": "18",
    ":val2": "11",
  },
  ExpressionAttributeNames: { "#bsId": "basin_id", "#deleted": "_deleted" },
  TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
};
const getDriversQuery = {
  KeyConditionExpression: "classification = :cs",
  ProjectionExpression: "id, cat, dd_tenant, gsi1sk",
  IndexName: "byClass",
  FilterExpression: "attribute_not_exists(#deleted) AND (#dd <> :val)",
  ExpressionAttributeValues: {
    ":cs": "DRIVER",
    ":val": "TENANT#",
  },
  ExpressionAttributeNames: { "#dd": "dd_tenant", "#deleted": "_deleted" },
  TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
};

const generateJobsQuery = (field, values, tenantId) => {
  let filterExp = "attribute_not_exists(#deleted) AND (#field = :0";
  let expAttValues = {
    ":cs": `JOB#${tenantId}`,
    ":0": values[0],
  };
  for (let i = 1; i < values.length; i++) {
    filterExp += ` OR #field = :${i}`;
    expAttValues[`:${i}`] = values[i];
  }
  filterExp += ")";
  return {
    KeyConditionExpression: "cat = :cs",
    IndexName: "byCategory",
    FilterExpression: filterExp,
    ExpressionAttributeValues: expAttValues,
    ExpressionAttributeNames: { "#field": field, "#deleted": "_deleted" },
    TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
  };
};
const generateLoadsQuery = (jobId, tenantId) => {
  return {
    KeyConditionExpression: "job_id = :jobId  AND #cat = :val",
    IndexName: "byJobId",
    FilterExpression: "attribute_not_exists(#deleted)",
    ExpressionAttributeValues: {
      ":jobId": jobId,
      ":val": `LOAD#${tenantId}`,
    },
    ExpressionAttributeNames: { "#cat": "cat", "#deleted": "_deleted" },
    TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
  };
};
const createItem = (data) => {
  return {
    Item: {
      ...data,
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
  };
};
const updateItem = (data) => {
  return {
    Key: {
      id: data.id,
      cat: data.cat,
    },
    UpdateExpression: "set gsi1sk = :val1 , dd_tenant = :val2 ",
    ExpressionAttributeValues: {
      ":val1": data.gsi1sk,
      ":val2": data.dd_tenant,
    },
    ReturnValues: "ALL_NEW",
    TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
  };
};
const createBulkItems = (values) => {
  let query = {};
  query[process.env.API_CATHERD_CATHERDTABLE_NAME] = values.map((e) => {
    return { PutRequest: { Item: { ...e } } };
  });
  return {
    RequestItems: query,
  };
};

const getAllData = async (filter) => {
  var dynamodb = new AWS.DynamoDB.DocumentClient();
  let params = {
    // Set the projection expression, which are the attributes that you want.
    ...filter,
    Limit: 100,
  };
  try {
    let lastEvaluatedKey = "grupo1";
    let itemsAll = [];
    let page = 0;
    while (lastEvaluatedKey) {
      const data = await dynamodb.query(params).promise();
      itemsAll.push(...data.Items);
      lastEvaluatedKey = data.LastEvaluatedKey;
      if (lastEvaluatedKey) {
        params.ExclusiveStartKey = lastEvaluatedKey;
      }
      console.log("page ", page++);
    }
    return itemsAll;
    // console.log(customerMeta);
  } catch (err) {
    return err;
  }
  // return data;
};

module.exports = {
  getTargetsQuery,
  getJobsQuery,
  getAllData,
  getZonesQuery,
  generateJobsQuery,
  getDriversQuery,
  generateLoadsQuery,
  createItem,
  updateItem,
};
