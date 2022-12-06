/* Amplify Params - DO NOT EDIT
	API_CATHERD_CATHERDTABLE_ARN
	API_CATHERD_CATHERDTABLE_NAME
	API_CATHERD_GLOBALLOOKUPSTABLE_ARN
	API_CATHERD_GLOBALLOOKUPSTABLE_NAME
	API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT
	API_CATHERD_GRAPHQLAPIIDOUTPUT
	API_CATHERD_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
	API_CATHERD_CATHERDTABLE_ARN
	API_CATHERD_CATHERDTABLE_NAME
	API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT
	API_CATHERD_GRAPHQLAPIIDOUTPUT
	API_CATHERD_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
 const axios = require("axios");
 const AWS = require("aws-sdk");
 const { getPdBaseUrl } = require("/opt/envHelpers")
 
 AWS.config.update({
   accessKeyId: process.env.AWS_ACCESSKEY,
   secretAccessKey: process.env.AWS_SECRETACCESSKEY,
   region: process.env.AWS_REGIONNAME,
   sessionToken: process.env.AWS_SESSION_TOKEN,
 });
 
 let myDocClient = new AWS.DynamoDB(); // Create the DynamoDB service object
 const addByBatchCall = async(batch_list, tableName) =>{
     try{
       for (let batchList of batch_list) {
         var params = {
           RequestItems: {
             [tableName]: batchList,
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
     }catch(e){
         console.log(e)
     }
 }
 exports.handler = async (event) => {
   try {
    
     let baseUrl = getPdBaseUrl(process.env.ENV)
     const crewResponse = await axios({
       url: `${baseUrl}/pch/pch_sync/crew`,
       method: "GET",
       headers: {
         "x-api-key": "7b7aa78f506a40bc0320fa308efc19bf",
       },
     });
     if (crewResponse?.data?.data) {
       let batch_list = [];
       let itemList = [];
       crewResponse.data.data.map((crewItem, index) => {
         let marshalled_item = AWS.DynamoDB.Converter.marshall({
           id: `CREW#${crewItem.id}`,
           crew_name: crewItem.name,
           cat: "CREW",
           dd_tenant: `TENANT#${crewItem.tenant_id}`,
           _version: 1,
           _typename: "CatHerd",
           createdAt: new Date().toISOString(),
           updatedAt: new Date().toISOString(),
           _lastChangedAt: new Date().getTime(),
           tenant_id: crewItem.tenant_id ?? "",
           tenant_name: crewItem?.tenant_name ?? "",
           district_id: crewItem?.district_id ?? 0
         });
 

         
         itemList.push({
           PutRequest: {
             Item: marshalled_item,
           },
         });
         if (
           (index % 24 === 0 && index !== 0) ||
           index === crewResponse.data.data.length - 1
         ) {
           batch_list.push(itemList);
           itemList = [];
         }
       });
       await addByBatchCall(batch_list, process.env.API_CATHERD_CATHERDTABLE_NAME)
     }
     
     const districtResponse = await axios({
       url: `${baseUrl}/pch/pch_sync/district`,
       method: "GET",
       headers: {
         "x-api-key": "7b7aa78f506a40bc0320fa308efc19bf",
       },
     });
     if (districtResponse?.data?.data) {
       let batch_list = [];
       let itemList = [];
       districtResponse.data.data.map((districtItem, index) => {
         let marshalled_item = AWS.DynamoDB.Converter.marshall({
           id: `DISTRICT#${districtItem.id}`,
           district_name: districtItem.name,
           cat: "DISTRICT",
           dd_tenant:`TENANT#${districtItem.tenant_id}`,
           _version: 1,
           _typename: "CatHerd",
           createdAt: new Date().toISOString(),
           updatedAt: new Date().toISOString(),
           _lastChangedAt: new Date().getTime(),
           tenant_id: districtItem.tenant_id ?? "",
           tenant_name: districtItem?.tenant_name ?? "",
         });
 
         itemList.push({
           PutRequest: {
             Item: marshalled_item,
           },
         });
         if (
           (index % 24 === 0 && index !== 0) ||
           index === districtResponse.data.data.length - 1
         ) {
           batch_list.push(itemList);
           itemList = [];
         }
       });
       await addByBatchCall(batch_list, process.env.API_CATHERD_CATHERDTABLE_NAME)
     }
     
     
     const basinResponse = await axios({
       url: `${baseUrl}/pch/pch_sync/basin`,
       method: "GET",
       headers: {
         "x-api-key": "7b7aa78f506a40bc0320fa308efc19bf",
       },
     });
     if (basinResponse?.data?.data) {
       let batch_list = [];
       let itemList = [];
       basinResponse.data.data.map((basinItem, index) => {
         let marshalled_item = AWS.DynamoDB.Converter.marshall({
           id: `BASIN#${basinItem.id}`,
           name: basinItem.name,
           cat: "BASIN",
           _version: 1,
           createdAt: new Date().toISOString(),
           updatedAt: new Date().toISOString(),
           _lastChangedAt: new Date().getTime(),
         });
 
         itemList.push({
           PutRequest: {
             Item: marshalled_item,
           },
         });
         if (
           (index % 24 === 0 && index !== 0) ||
           index === basinResponse.data.data.length - 1
         ) {
           batch_list.push(itemList);
           itemList = [];
         }
       });
       await addByBatchCall(batch_list, process.env.API_CATHERD_GLOBALLOOKUPSTABLE_NAME)
     }
     
   } catch (e) {
     console.log("error--------", e);
     return null;
   }
 };
 
 