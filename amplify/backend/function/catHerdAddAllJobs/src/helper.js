"use strict";
const axios = require('axios');
const gql = require('graphql-tag');
const graphql = require('graphql');
const { getPdBaseUrl, getPaginatedData } = require("/opt/envHelpers")
const { dataByCategory } = require("/opt/graphql/queries");
const AWS = require('aws-sdk');

const { print } = graphql;
Object.defineProperty(exports, "__esModule", {
    value: true
});

 AWS.config.update({
  "accessKeyId": process.env.AWS_ACCESS_KEY_ID, 
  "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY, 
  "region":process.env.AWS_REGION,
  "sessionToken":process.env.AWS_SESSION_TOKEN
});

var lambda = new AWS.Lambda();

const invokeLambda = async (lambdaFunctionName, payload) => {

   console.log('>>> Entering invokeLambda');
   let payloadStr;
   if (typeof payload === 'string')
   {
       console.log('invokeLambda:  payload parameter is already a string: ', payload);
       payloadStr = payload;
   }
   else
   {
       payloadStr = JSON.stringify(payload, null, 2);
       console.log('invokeLambda: converting payload parameter to a string: ', payloadStr);
   }

   let params = {
       FunctionName   : lambdaFunctionName,
       InvocationType : 'RequestResponse',
       LogType        : 'None',
       Payload        : payloadStr,
   };
   const lambdaResult = await lambda.invoke(params).promise();
   console.log('Results from invoking lambda ' + lambdaFunctionName + ': ' , JSON.stringify(lambdaResult, null, 2) );
   if (lambdaResult.LogResult)
   {
       console.log('Logs of lambda execution: ',  Buffer.from(lambdaResult.LogResult, 'base64').toString());
   }
   console.log('invokeLambdaSync::lambdaResult: ', lambdaResult)
   console.log('<<< Returning from invokeLambda, with lambdaResult: ', JSON.stringify(lambdaResult, null, 2));
   return lambdaResult;
};

const setZoneToJobs = async() => {
    const zones = await getPaginatedData(
          {
            messageNextToken: null , 
            resData: [], 
            variables:{
                   cat: "ZONE",
              } , 
            query: dataByCategory,
            queryName: 'dataByCategory',
            url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
            method: 'post'
          }
    )
    
    for (let zone of zones){
        console.log('---------',zone.id)
        if(zone?.jobs !== '' && zone?.jobs){
          let jobs = zone?.jobs?.split(',')
          console.log('-----',process.env.FUNCTION_CATHERDJOBBATCH_NAME)
          await invokeLambda(process.env.FUNCTION_CATHERDJOBBATCH_NAME, {jobs: jobs,'triggerType': 'UPDATE_ADD', zoneId: zone.id, zone: zone});
        }
    }
}

module.exports = {
    setZoneToJobs
};