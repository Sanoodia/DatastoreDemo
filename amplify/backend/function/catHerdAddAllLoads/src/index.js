/* Amplify Params - DO NOT EDIT
	API_CATHERD_CATHERDTABLE_ARN
	API_CATHERD_CATHERDTABLE_NAME
	API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT
	API_CATHERD_GRAPHQLAPIIDOUTPUT
	API_CATHERD_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */'use strict';
const axios = require('axios');
const AWS = require('aws-sdk');
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;
const { databyClassification } = require('/opt/graphql/queries')
const { getPdBaseUrl, getPaginatedData } = require("/opt/envHelpers")

  AWS.config.update({ 
    "accessKeyId": process.env.AWS_ACCESSKEY, 
    "secretAccessKey": process.env.AWS_SECRETACCESSKEY, 
    "region": process.env.AWS_REGIONNAME 
  });
  let myDocClient = new AWS.DynamoDB(); // Create the DynamoDB service object


exports.handler = async (event) => {
    try {
        //fetching all loads record from dynamo
        let resData = await getPaginatedData(
          {messageNextToken: null , 
          resData: [], 
          variables:{
                classification: 'JOB',
              } , 
          query: databyClassification,
          queryName: 'databyClassification',
          url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
          method: 'post'})
        let dynamoJobs = {}
        if(resData !== null){
          resData.map((item)=>{
            if(item !== null){
              dynamoJobs[`${item.id}#${item.tenant_id}`] = item; //JOB#id#tenant_id
            }
          })
        }
        //getting all PD loads
        let baseUrl = getPdBaseUrl(process.env.ENV)
         const response = await axios({
          url: `${baseUrl}/pch/pch_sync/load`,
          method: 'GET',
          headers: {
            'x-api-key': '7b7aa78f506a40bc0320fa308efc19bf'
          }
        });
        if(response?.data?.data){
          let batch_list = []
          let itemList = []
          response.data.data.map((loadItem,index)=>{
            let dynamoJobId =  `JOB#${loadItem.job_id}#${loadItem.tenant_id}`; //JOB#id#tenant_id
            let marshalled_item =  AWS.DynamoDB.Converter.marshall( {
                  "id": `LOAD#${loadItem.id}`,
                  "load_name":  loadItem.product_name,
                  "cat":  `LOAD#${loadItem.tenant_id}` ,
                  "classification": "LOAD",
                  "load_id": loadItem?.id ?? null,
                  "gsi1sk":  (dynamoJobs[dynamoJobId])? dynamoJobs[dynamoJobId].gsi1sk : "ZONE#" ,
                  "dd_tenant": `TENANT#${loadItem.tenant_id}`,
                  "type": (dynamoJobs[dynamoJobId])? dynamoJobs[dynamoJobId].type: "LOAD_ZONE#",
                  "is_assigned": (loadItem && loadItem.load_assign_status !== null && loadItem.load_assign_status === '1')? true: false ,
                  "createdAt": new Date().toISOString(),
                  "updatedAt": new Date().toISOString(),
                  "district_id": (dynamoJobs[dynamoJobId])? dynamoJobs[dynamoJobId].district_id : "",
                  "district_name": (dynamoJobs[dynamoJobId])? dynamoJobs[dynamoJobId].district_name : "",
                  "_version": 1,
                  // "_deleted": false,
                  "_typename": "CatHerd",
                  "_lastChangedAt": new Date().getTime(),
                  "load_no": (loadItem && loadItem.load_no !== null)? loadItem.load_no : "" ,
                  "job_id": (loadItem && loadItem.job_id !== null)? loadItem.job_id : "" ,
                  "linked_terminal_id": (loadItem && loadItem.linked_terminal_id !== null)? loadItem.linked_terminal_id : "" ,
                  "terminal_id": (loadItem && loadItem.linked_terminal_id !== null)? loadItem.linked_terminal_id : "" ,
                  "terminal_name": (loadItem && loadItem.terminal_name !== null)? loadItem.terminal_name : "" ,
                  "linked_product_id": (loadItem && loadItem.linked_product_id !== null)? loadItem.linked_product_id : "" ,
                  "product_id": (loadItem && loadItem.product_id !== null)? loadItem.product_id : "" ,
                  "product_name": (loadItem && loadItem.product_name !== null)? loadItem.product_name : "" ,
                  "stage": (loadItem && loadItem.stage !== null)? loadItem.stage : "" ,
                  "job_name": (loadItem && loadItem.job_name !== null)? loadItem.job_name : "" ,
                  "tenant_id": (loadItem && loadItem.tenant_id !== null)? loadItem.tenant_id : "" ,
                  "tenant_name": (loadItem && loadItem.tenant_name !== null)? loadItem.tenant_name : "" ,
                  "tenant_type":  (loadItem && loadItem.tenant_type !== null)? loadItem.tenant_type : "",
                  "load_status": (loadItem && loadItem.load_assign_status !== null)? loadItem.load_assign_status : "0",
                  "assigned_driver": (loadItem && loadItem.driver_id !== null)? `DRIVER#${loadItem.driver_id}` : null ,
                  "operator_id": (loadItem && loadItem.operator_id !== null)? loadItem.operator_id : "" ,
                  "operator_name": (loadItem && loadItem.operator_name !== null)? loadItem.operator_name : "" ,
                  "load_created_at": new Date(loadItem.load_created_at).toISOString() ?? new Date().toISOString(),
            });
            
            itemList.push({
              PutRequest: {
                Item: marshalled_item
              }
            })
            if((index % 24 === 0 && index !== 0) || index === response.data.data.length -1){
              batch_list.push(itemList)
              itemList = []
            }
          })
          for(let batchList of batch_list){
            var params = {
              RequestItems: {
                [process.env.API_CATHERD_CATHERDTABLE_NAME]: batchList
              }
            }
            try{
              const lambdaResult = await myDocClient.batchWriteItem(params).promise()
                console.log("batch sucessfull",lambdaResult)
              }catch(e){
                console.log('batch error',e)
            }
          }
        }else{
          console.log('axio response error', response)
        }
    }catch(e){
        console.log(e)
        return null
    }
};