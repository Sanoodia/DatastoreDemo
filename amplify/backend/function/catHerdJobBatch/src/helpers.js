

"use strict";


const axios = require("axios");
const graphql = require("graphql");
const { print } = graphql;
const gql = require("graphql-tag");
const {
  updateCatHerd,
} = require("/opt/graphql/mutations");


const updateDrDeck = async (_input) => {
  console.log("----exec: ", new Date(), _input);
  try {
    let response = await axios({
      url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
      method: "post",
      headers: {
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
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log(response)
    if (response.data.data) console.log("Solution: ", response.data.data);
    else console.log("Unable to update load", _input);
  }
  catch (err) {
    console.log("Error Updating DrDeck", err);

  }
};


module.exports = {
  updateDrDeck
};