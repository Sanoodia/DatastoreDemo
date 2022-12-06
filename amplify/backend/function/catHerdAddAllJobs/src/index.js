/* Amplify Params - DO NOT EDIT
	API_CATHERD_CATHERDTABLE_ARN
	API_CATHERD_CATHERDTABLE_NAME
	API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT
	API_CATHERD_GRAPHQLAPIIDOUTPUT
	API_CATHERD_GRAPHQLAPIKEYOUTPUT
	ENV
	FUNCTION_CATHERDJOBBATCH_NAME
	FUNCTION_CATHERDLOADBATCH_NAME
	REGION
Amplify Params - DO NOT EDIT */
"use strict";
const axios = require("axios");
const AWS = require("aws-sdk");
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;
const { databyClassification } = require("/opt/graphql/queries");
const { getPdBaseUrl, getPaginatedData } = require("/opt/envHelpers")
const {setZoneToJobs} = require("helper")

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESSKEY,
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  region: process.env.AWS_REGIONNAME,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});

let myDocClient = new AWS.DynamoDB(); // Create the DynamoDB service object

exports.handler = async (event) => {
  try {
     const data = await getPaginatedData(
          {
            messageNextToken: null , 
            resData: [], 
            variables:{
                   classification: "JOB",
              } , 
            query: databyClassification,
            queryName: 'databyClassification',
            url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
            method: 'post'
          }
    )
    let myJson = {};
   
    if(data !== null){
      data.map((item) => {
        myJson[`${item.id}#${item.tenant_id}`] = item; //JOB#id#tenant_id
      });
    }
    let baseUrl = getPdBaseUrl(process.env.ENV)
    const response = await axios({
      url: `${baseUrl}/pch/pch_sync/job_detail`,
      method: "GET",
      headers: {
        "x-api-key": "7b7aa78f506a40bc0320fa308efc19bf",
      },
    });
    if (response?.data?.data) {
      let batch_list = [];
      let itemList = [];
      response.data.data.map((jobItem, index) => {
        let marshalled_item = AWS.DynamoDB.Converter.marshall({
          id: `JOB#${jobItem.id}`,
          job_name: jobItem.name,
          job_id: jobItem.id,
          working_status: jobItem.working_status ?? "",
          cat: `JOB#${jobItem.tenant_id}`,
          classification: "JOB",
          gsi1sk: myJson[`JOB#${jobItem.id}#${jobItem.tenant_id}`]
            ? myJson[`JOB#${jobItem.id}#${jobItem.tenant_id}`].gsi1sk
            : "ZONE#",
          dd_tenant:  `TENANT#${jobItem.tenant_id}`,
          type:myJson[`JOB#${jobItem.id}#${jobItem.tenant_id}`]
            ? myJson[`JOB#${jobItem.id}#${jobItem.tenant_id}`].type
            : "JOB_ZONE#",
          job_status: jobItem && jobItem.status ,
          _version: 1,
          // _deleted: false,
          _typename: "CatHerd",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _lastChangedAt: new Date().getTime(),
          district_id:
            jobItem && jobItem.district_id !== null ? jobItem.district_id : "",
          district_name:
            jobItem && jobItem.district_name !== null
              ? jobItem.district_name
              : "",
          crew_id: jobItem && jobItem.crew_id !== null ? jobItem.crew_id : "",
          crew_name:
            jobItem && jobItem.crew_name !== null ? jobItem.crew_name : "",
          basin_id:
            jobItem && jobItem.basin_id !== null ? jobItem.basin_id : "",
          basin_name:
            jobItem && jobItem.basin_name !== null ? jobItem.basin_name : "",
          linked_carrier: jobItem.linked_carrier || [],
          tenant_id: jobItem.tenant_id ?? "",
          tenant_name: jobItem.tenant_name ?? "",
          tenant_type: jobItem.tenant_type ?? "",
        });

        itemList.push({
          PutRequest: {
            Item: marshalled_item,
          },
        });
        if (
          (index % 24 === 0 && index !== 0) ||
          index === response.data.data.length - 1
        ) {
          batch_list.push(itemList);
          itemList = [];
        }
      });
      for (let batchList of batch_list) {
        var params = {
          RequestItems: {
            [process.env.API_CATHERD_CATHERDTABLE_NAME]: batchList,
          },
        };
        try {
          const lambdaResult = await myDocClient
            .batchWriteItem(params)
            .promise();
          console.log("batch sucessfull", lambdaResult);
        } catch (e) {
          console.log("batch error", e);
        }
      }
      //------------------Zone integration-----------------   
      if(data.length === 0){
        await setZoneToJobs()
      }     
    }
  } catch (e) {
    console.log("error--------", e);
    return null;
  }
};
