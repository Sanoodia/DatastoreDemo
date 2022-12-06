"use strict";

const axios = require("axios");
const gql = require("graphql-tag");
const graphql = require("graphql");
const AWS = require("aws-sdk");
const { updateCatHerd } = require("./graphql/mutations");

const { print } = graphql;
Object.defineProperty(exports, "__esModule", {
  value: true,
});

const getPdBaseUrl = (enviroment) => {
  switch (enviroment) {
    case "predev":
      return "https://api.propdispatch.com";
    case "dev":
      return "https://devapi.propdispatch.com";
    case "prod":
    case "live":
    case "production":
      return "https://api.propdispatch.com";
    case "stage":
    case "bravo":
    case "play":
      return "https://stage-api.propdispatch.com";
    default:
      return "https://devapi.propdispatch.com";
  }
};
const getESDomain = (enviroment) => {
  switch (enviroment) {
    case "predev":
      return "search-driverdeck-dd-es-predev-o46wtfbsr3yctlarpwd2oey45u.us-east-1.es.amazonaws.com";
    case "dev":
      return "search-driverdeck-dd-es-dev-d3abaofbhx3wuint5jbqfpoqr4.us-east-1.es.amazonaws.com";
    case "live":
        return "search-driverdeck-dd-es-live-k62isbryuq6r7onap2e3zqezqi.us-east-1.es.amazonaws.com";
    case "prod":
    case "production":
      return "search-driverdeck-dd-es-production-5qak7727bzmnxoxj3kxmcdwt5q.us-east-1.es.amazonaws.com";
    case "stage":
    case "bravo":
    case "play":
      return "search-driverdeck-dd-es-bravo-ddsigd3qli6zhpo4wywudcvljm.us-east-1.es.amazonaws.com";
    default:
      return "search-driverdeck-dd-es-alpha-jfaxzlfsandkb5ldyzuwpk7lre.us-east-1.es.amazonaws.com";
  }
};

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
const validateToken = async (enviroment, token) => {
  try {
    let baseUrl = getPdBaseUrl(enviroment);
    const validateRes = await axios({
      url: `${baseUrl}/user/tokenValidator`,
      method: "GET",
      headers: {
        token: token,
        type: "2",
        "X-API-KEY": "7b7aa78f506a40bc0320fa308efc19bf",
      },
    });
    if (validateRes?.data?.code === 200) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
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

module.exports = {
  getPaginatedData,
  getPdBaseUrl,
  getESDomain,
  deleteForever,
  updateDrDeck,
  validateToken
};
