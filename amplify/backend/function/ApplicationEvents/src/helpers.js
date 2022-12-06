const AWS = require("aws-sdk");

const axios = require("axios");
const graphql = require("graphql");
const { print } = graphql;
const gql = require("graphql-tag");
const {
  createCatHerd,
  updateCatHerd,
  deleteCatHerd,
} = require("/opt/graphql/mutations");
const {
    getCatHerd,
} = require("/opt/graphql/queries");

const dynamodb = new AWS.DynamoDB.DocumentClient();

//this will reset all linked jobs and loads
const resetZoneLinks = async (_zoneId) => {
  //TODO: reset gsi1pk for all jobs and loads. gsi1pk='ZONE#'
  // :: lambda layer is added in this function.

  const zoneItems = await getAllZoneLinks(_zoneId);
  // return zoneItems.Items.length;

  const allZoneReset = zoneItems.map((item) => {
    let updatedItem = {
      id: item.id,
      cat: item.cat,
      _version: item._version,
      gsi1sk: "ZONE#",
    };
    if (item.is_assigned) {
      updatedItem["is_assigned"] = false;
    }
    return updateDrDeck(updatedItem);
  });

  return Promise.all(allZoneReset);
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
      
    let lastEvaluatedKey = "grupo1";
    let itemsAll = [];
    try{
             while (lastEvaluatedKey) {
              const result = await dynamodb.scan(params).promise();
             itemsAll.push(...result.Items);
              lastEvaluatedKey = result.LastEvaluatedKey;
              if (lastEvaluatedKey) {
                params.ExclusiveStartKey = lastEvaluatedKey;
              }
            }
            

        return itemsAll;
    } catch(e){
      console.log("Exception: ", e);
      return []
    }

};

const resolveDriverTenant = async (props) => {
  const dynamodb = new AWS.DynamoDB();
  // props: {NewImage, OldImage}
  console.log("resolving driver...");
  console.log(props);
  const getDriverParams = {
    TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
    KeyConditionExpression: "id = :id ",
    ExpressionAttributeValues: {
      ":id": {
        S: props.NewImage.id,
      },
    },
  };

  try {
    console.log("params: ", getDriverParams);
    console.log("RESPONSE...");
    const resp = await dynamodb.query(getDriverParams).promise();
    for (const i of resp.Items) {
      console.log(AWS.DynamoDB.Converter.unmarshall(i));
    }
    // console.log(resp);
    return resp;
  } catch (e) {
    console.log("error getting driver to resolve...", e);
    return e;
  }
};

const updateDrDeck = async (_input) => {
  console.log("----exec: ", new Date());
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${updateCatHerd}
          `
        ),
        variables: {
          input: _input,
        },
      },
    });
    if (response.data.data) console.log("Solution: ", response.data.data);
    else console.log("Unable to update data", _input);
  } catch (err) {
    console.log("Error Updating DrDeck", err);
  }
};

const deleteDrDeck = async (_variables) => {
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
        // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
        Authorization: "SUPER_ACCESS_DD",
      },
      data: {
        query: print(
          gql`
            ${deleteCatHerd}
          `
        ),
        variables: _variables,
      },
    });
    if (response.data) {
      console.log("success: ", response.data);
    } else {
      console.log("error deleting load from db : ", _variables);
    }
  } catch (err) {
    console.log("Error in sending data", err);
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
                query: print(
                    gql`
            ${getCatHerd}
          `
                ),
                variables: _variables,
            },
        });
        if (response?.data?.data?.getCatHerd) return response.data.data.getCatHerd;
        else return null;
    }
    catch (err) {
        console.log("Error Getting Zone", err);
    }
};

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

const resolveZoneAggrigation = async (props, _count, agr_key) => {
  // props: {zone,  1}

  const zone = {
    TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames: {
      "#id": "id",
    },
    ExpressionAttributeValues: {
      ":id": `${props.zone}`,
    },
  };
  const zoneItems = await dynamodb.query(zone).promise();

  console.log(zoneItems);
  if (zoneItems.Items.length > 0) {
    const item = zoneItems.Items[0];
    console.log(`${agr_key} ${item[agr_key]} + ${_count}`);
    item[agr_key] = item[agr_key] ?? 0;
    let updatedItem = {
      id: item.id,
      cat: item.cat,
      _version: item._version,
      [agr_key]: item[agr_key] + _count > -1 ? item[agr_key] + _count : 0,
    };
    console.log(
      "updating zone aggregation ___________________________",
      updatedItem
    );
    await updateDrDeck(updatedItem);
  }
};

module.exports = {
  resetZoneLinks,
  isEmpty,
  getDrDeck,
  updateDrDeck,
  deleteDrDeck,
  resolveDriverTenant,
  resolveZoneAggrigation,
};
