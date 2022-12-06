var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB.DocumentClient();
const axios = require("axios");
const graphql = require("graphql");
const { print } = graphql;
const gql = require("graphql-tag");
const { getPdBaseUrl } = require("/opt/envHelpers");
const { updateCatHerd } = require("/opt/graphql/mutations");
const {
  getCatHerd,
  listCatHerds,
  dataByCategory,
  databyClassification,
} = require("/opt/graphql/queries");
// const { getPaginatedData } = require("/opt/envHelpers")
const getPaginatedData = async ({
  messageNextToken = null,
  resData = [],
  variables,
  query,
  queryName,
  url,
  method,
}) => {
  try {
    const { data } = await axios({
      url: url,
      method: method,
      headers: {
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${query}
          `
        ),
        variables: {
          ...variables,
          nextToken: messageNextToken,
        },
      },
    });
    if (data?.data[queryName]?.items) {
      resData = [...resData, ...data?.data[queryName]?.items];
    }
    if (data?.data[queryName]?.nextToken) {
      return await getPaginatedData({
        messageNextToken: data?.data[queryName]?.nextToken,
        resData,
        variables,
        query,
        queryName,
        url,
        method,
      });
    } else {
      return resData;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};
const api = axios.create({
  headers: {
    token: "622df847ab699",
    "X-API-KEY": "7b7aa78f506a40bc0320fa308efc19bf",
  },
  baseURL: getPdBaseUrl(process.env.ENV),
});
//this will reset all linked jobs and loads
const resetZoneLinks = async (_zoneId) => {
  //TODO: reset gsi1pk for all jobs and loads. gsi1pk='ZONE#'
  // :: lambda layer is added in this function.
  const zoneItems = await getAllZoneLinks(_zoneId);
  // return zoneItems.Items.length;
  let counter = 0;
  for (const item of zoneItems.Items) {
    const UpdateParams = {
      TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
      Key: {
        id: item.id,
        cat: item.cat,
      },
      UpdateExpression: "set gsi1sk = :gsi1sk",
      ExpressionAttributeValues: { ":gsi1sk": "ZONE#" },
      ReturnValues: "UPDATED_NEW",
    };
    await dynamodb.update(UpdateParams).promise();
    counter++;
  }
  return counter;
};
// gets all the itmes that belongs to a specific zone
const getAllZoneLinks = async (_zoneId) => {
  const params = {
    // Specify which items in the results are returned.
    FilterExpression: "gsi1sk = :zone",
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: {
      ":zone": _zoneId,
    },
    // Set the projection expression, which are the attributes that you want.
    TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
  };
  const result = await dynamodb.scan(params).promise();
  console.log("all data.... : %j", result);
  return result;
};
const getDrDeckByList = async (_variables) => {
  let variables = _variables;
  let query = listCatHerds;
  let queryName = "listCatHerds";
  let url = process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT;
  let method = "post";
  try {
    let data = await getPaginatedData({
      variables,
      query,
      queryName,
      url,
      method,
    });
    return data;
  } catch (err) {
    console.log("Unable to get data by list", _variables);
    return null;
  }
};
const getDrDeck = async (_variables) => {
  // get driver accepted loads and verion information
  try {
    const response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(gql`
          ${getCatHerd}
        `),
        variables: _variables,
      },
    });
    if (response?.data?.data?.getCatHerd) return response.data.data.getCatHerd;
    else return null;
  } catch (err) {
    console.log("Error Getting Zone", err);
  }
};
const getAllDeletedZones = async () => {
  const params = {
    // Specify which items in the results are returned.
    FilterExpression: "cat = :zone and #del = :del",
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: {
      ":zone": "ZONE",
      ":del": true,
    },
    ExpressionAttributeNames: {
      "#del": "_deleted",
    },
    // Set the projection expression, which are the attributes that you want.
    TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
  };
  const result = await dynamodb.scan(params).promise();
  console.log("all deleted zones.... : %j", result);
  return result;
};
async function getAllData(filter) {
  var dynamodb = new AWS.DynamoDB.DocumentClient();
  let params = {
    // Set the projection expression, which are the attributes that you want.
    ProjectionExpression: "id, cat",
    ...filter,
    Limit: 100,
    TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
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
}
const getAllByCat = async (cat) => {
  let variables = {
    cat: cat,
  };
  let query = dataByCategory;
  let queryName = "dataByCategory";
  let url = process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT;
  let method = "post";
  try {
    let data = await getPaginatedData({
      variables,
      query,
      queryName,
      url,
      method,
    });
    return data;
  } catch (err) {
    console.log("Unable to get data by category", variables);
    return null;
  }
};
const getAllByClass = async (zone) => {
  let variables = {
    classification: "DRIVER",
    filter: {
      gsi1sk: { eq: zone },
    },
  };
  let query = databyClassification;
  let queryName = "databyClassification";
  let url = process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT;
  let method = "post";
  try {
    let data = await getPaginatedData({
      variables,
      query,
      queryName,
      url,
      method,
    });
    return data;
  } catch (err) {
    console.log("Unable to get data by category", variables);
    return null;
  }
};

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
async function deleteItem(Item) {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  try {
    let params = {
      TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
      Key: {
        id: `${Item.id}`,
        cat: `${Item.cat}`,
      },
    };
    console.log("Deleteing item", params.Key);
    let results = await dynamodb.delete(params).promise();
    console.log(`Done: ${JSON.stringify(results)}`);
  } catch (err) {
    return err;
  }
  return 1;
}
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
const getLoadsToDelete = async (days) => {
  try {
    const response = await api.get(
      `/pch/pch_sync/delivered_load?x_days=${days}`
    );
    return response?.data?.data ?? null;
  } catch (error) {
    console.log(error);
  }
};
const updateDrDeck = async (_input) => {
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(gql`
          ${updateCatHerd}
        `),
        variables: {
          input: _input,
        },
      },
    });
    if (response?.data?.data) console.log("Solution: ", response.data.data);
    else console.log("Unable to update load", _input);
  } catch (err) {
    console.log("Error Updating DrDeck", err);
    return err;
  }
};
const resetDriverZone = async () => {
  //TODO: reset gsi1pk for all jobs and loads. gsi1pk='ZONE#'
  // :: lambda layer is added in this function.
  const alldata = await getAllData({
    ExpressionAttributeValues: {
      ":cat": `DRIVER`,
    },
    FilterExpression: "classification = :cat",
  });
  const resetAllDrivers = alldata.map((_data) => {
    return resetZone({
      id: _data.id,
      cat: _data.cat,
    });
  });
  return await Promise.all(resetAllDrivers);
};
const resetZone = async (item) => {
  const UpdateParams = {
    TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
    Key: {
      id: item.id,
      cat: item.cat,
    },
    UpdateExpression: "set gsi1sk = :gsi1sk",
    ExpressionAttributeValues: { ":gsi1sk": "ZONE#" },
    ReturnValues: "UPDATED_NEW",
  };
  try {
    return await dynamodb.update(UpdateParams).promise();
  } catch (e) {
    console.log("Exception: 199: ", e);
    return e;
  }
};
module.exports = {
  getDrDeck,
  resetZoneLinks,
  getAllDeletedZones,
  isEmpty,
  getAllData,
  deleteItem,
  deleteForever,
  getLoadsToDelete,
  getDrDeckByList,
  updateDrDeck,
  resetDriverZone,
  resetZone,
  getAllByCat,
  getAllByClass,
};
