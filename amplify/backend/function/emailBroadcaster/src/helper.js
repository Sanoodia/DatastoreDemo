const axios = require("axios");
const graphql = require("graphql");
const { print } = graphql;
const gql = require("graphql-tag");

const { databyClassification } = require("/opt/graphql/queries");

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

const getAllTargetsByZone = async (_variables) => {
  let variables = _variables;
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
    console.log("Unable to get data", _variables);
    return null;
  }
};

module.exports = {
  getAllTargetsByZone,
};
