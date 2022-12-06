/* Amplify Params - DO NOT EDIT
	API_CATHERD_CATHERDTABLE_ARN
	API_CATHERD_CATHERDTABLE_NAME
	API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT
	API_CATHERD_GRAPHQLAPIIDOUTPUT
	API_CATHERD_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

"use strict";
 const helpers = require('helpers');
const axios = require("axios");
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;
const { updateCatHerd } = require("/opt/graphql/mutations");
const {dataByCategory} = require("/opt/graphql/queries")

const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});

var lambda = new AWS.Lambda();
let myDocClient = new AWS.DynamoDB();
const getCatHerd = gql`
  query GetCatHerd($id: ID!, $cat: String!) {
    getCatHerd(id: $id, cat: $cat) {
      id
      gsi1sk
      _version
    }
  }
`;

const createTodo = gql`
  mutation CreateCatHerd(
    $input: CreateCatHerdInput!
    $condition: ModelCatHerdConditionInput
  ) {
    createCatHerd(input: $input, condition: $condition) {
      id
      cat
      load_name
      job_name
      z_name
      driver_name
      status
      terminal
      district
      type
      shift
      gsi1sk
      carrier
      basin
      crew
      jobs
      load_no
      job_id
      linked_terminal_id
      terminal_id
      terminal_name
      linked_product_id
      product_id
      product_name
      stage
      createdAt
      updatedAt
      linked_carrier {
        carrier_id
        carrier_name
        carrier_linked_id
      }
      is_assigned
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
const deleteTodo = gql`
  mutation DeleteCatHerd(
    $input: DeleteCatHerdInput!
    $condition: ModelCatHerdConditionInput
  ) {
    deleteCatHerd(input: $input, condition: $condition) {
      id
      cat
      _version
      createdAt
      updatedAt
      _lastChangedAt
      _deleted
    }
  }
`;

const invokeDriverLambda = async (carriersList, triggerType, zoneId) => {
  let params = {
    FunctionName: process.env.FUNCTION_CATHERDDRIVERCALLS_NAME,
    InvocationType: "RequestResponse",
    LogType: "None",
    Payload: JSON.stringify(
      { carriers: carriersList, triggerType: triggerType, zoneId: zoneId },
      null,
      2
    ),
  };
  try {
    const lambdaResult = await lambda.invoke(params).promise();
    console.log(lambdaResult);
  } catch (e) {
    console.log("error in calling driver lambda", e);
  }
};
exports.handler = async (event) => {
  try {
    let jobs = event.jobs;
    let triggerType = event.triggerType;
    let zoneId = event.zoneId;
    if (
      triggerType === "UPDATE_ADD" ||
      (triggerType === "UPDATE_REMOVE" && jobs.length > 0)
    ) {
      let zone = event.zone;
      var params = {
            RequestItems: {
             [process.env.API_CATHERD_CATHERDTABLE_NAME]: {
               Keys: jobs.map((id) => {
                      return {
                       "id": {
                         S: `JOB#${id}`
                        }, 
                       "cat": {
                         S: `JOB#${zone.tenant_id}`
                        }
                      }
                    })
             }
            }
      }
      console.log(params)
      const result = await myDocClient.batchGetItem(params).promise();
      console.log("all data.... : %j", result);
      let allJobs = result?.Responses[process.env.API_CATHERD_CATHERDTABLE_NAME]
      if(allJobs.length > 0){
            let gsi1sk = (triggerType === "UPDATE_ADD")? zoneId :  "ZONE#"

            const itemsToUpdate =  allJobs.map((item)=>{
              item = AWS.DynamoDB.Converter.unmarshall(item) ;
              let to_update = {id: item.id, cat: item.cat, _version: item._version, gsi1sk : gsi1sk}
              console.log(to_update)
              return helpers.updateDrDeck(to_update);
              
              
            });
            console.log(itemsToUpdate);
            await Promise.all(itemsToUpdate);
        
      }
    }
    //else
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Jobs are empty ",
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};
