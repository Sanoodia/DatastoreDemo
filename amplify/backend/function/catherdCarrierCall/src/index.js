/* Amplify Params - DO NOT EDIT
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
 const gql = require("graphql-tag");
 const graphql = require("graphql");
 const { print } = graphql;
 
 const { createCatHerd, deleteCatHerd, updateCatHerd } = require("/opt/graphql/mutations");
 const {dataByZone, dataByCategory, databyClassification} = require("/opt/graphql/queries")
 const { getPdBaseUrl, getPaginatedData, deleteForever, validateToken, updateDrDeck } = require("/opt/envHelpers")
 
 
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
     if (response?.data) {
       console.log("success: ", response.data);
     } else {
       console.log("error deleting carrier from db : ", _variables);
     }
   } catch (err) {
     console.log("Error in sending data", err);
   }
 };
 
 const updateCarriers = async(jobs, newZoneImage, zoneId) =>{
  try{
   console.log(zoneId)
   let carrierList = []
 const dynamoCarrierList = await getPaginatedData(
           {
             messageNextToken: null , 
             resData: [], 
             variables:{
                    gsi1sk: newZoneImage.id,
                    cat: { eq: `CT#${newZoneImage.tenant_id}#${zoneId}` }
               } , 
             query: dataByZone,
             queryName: 'dataByZone',
             url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
             method: 'post'
           }
     )
         let oldCarriers = [];
         if(dynamoCarrierList !== null && dynamoCarrierList.length > 0){
             dynamoCarrierList.map((item) => {
                 oldCarriers.push(item.carrier_id)
             }) 
         }
         let indexesCarrier = oldCarriers;
         let baseUrl = getPdBaseUrl(process.env.ENV)
         if(jobs.length > 0){
             const response = await axios({
              url: `${baseUrl}/pch/pch_sync/carrier?job_id=[${jobs}]&tenant_id=[${newZoneImage.tenant_id}]`,
              method: 'GET',
              headers: {
               "X-API-KEY":"7b7aa78f506a40bc0320fa308efc19bf"
              }
             }); 
             if(response?.data?.data){
                 for (let carrier of response.data.data) {
                     
                     if(oldCarriers.includes(carrier.carrier_id)){
                         let index = indexesCarrier.indexOf(carrier.carrier_id)
                         console.log('already exists at', index, dynamoCarrierList[index]._version)
                         
                        //  await updateDrDeck({
                        //    "id": `CT#${carrier.carrier_id}#${zoneId}`,
                        //    "cat": `CT#${newZoneImage.tenant_id}#${zoneId}`,
                        //    "tenant_name": newZoneImage.tenant_name,
                        //    "dd_tenant": `TENANT#${newZoneImage.tenant_id}`,
                        //     _version: dynamoCarrierList[index]._version,
                        //   })
                         carrierList.push(dynamoCarrierList[index])
                          oldCarriers = oldCarriers.filter((id) => id !== carrier.carrier_id)
                     }else{
                         console.log('creating', carrier.carrier_id)
                         const graphqlData = await axios({
                          url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
                          method: 'post',
                          headers: {
                           Authorization: 'SUPER_ACCESS_DD'
                          },
                          data: {
                            query: print(gql`${createCatHerd}`),
                            variables: {
                              input: {
                              "id": `CT#${carrier.carrier_id}#${zoneId}`,
                              "cat": `CT#${newZoneImage.tenant_id}#${zoneId}`,
                              "am_target": 0,
                              "carrier_id": carrier.carrier_id,
                              "classification": "TARGET",
                              "gsi1sk": newZoneImage.id,
                              "pm_target": 0,
                              "tenant_id": newZoneImage.tenant_id,
                              "dd_tenant": `TENANT#${newZoneImage.tenant_id}`,
                              "tenant_name": newZoneImage.tenant_name,
                              "carrier_name": carrier.carrier_name
                              }
                            }
                          }
                        });
                        carrierList.push(graphqlData?.data?.data?.createCatHerd ?? {})
                    // console.log(graphqlData.data)
                     }
                 }
               
             }
         }
         
         if(oldCarriers.length > 0){
             for(let carrier of dynamoCarrierList ){
                 if(oldCarriers.includes(carrier.carrier_id)){
                     console.log('deleting',carrier)
                  await deleteDrDeck({
                   input: {
                     id: carrier.id,
                     cat: `CT#${newZoneImage.tenant_id}#${zoneId}`,
                     _version: carrier._version,
                   },
                 })
                 await deleteForever({
                     id: carrier.id,
                     cat: `CT#${newZoneImage.tenant_id}#${zoneId}`
                 })
                 }
             }
             
         } 
         // console.log('----------------------------List returned', carrierList)
         return carrierList;
  }catch(e){
    console.log('error in carrier call', e)
  }
 }
 
 exports.handler = async (event) => {
     try {
     // console.log(`EVENT: ${JSON.stringify(event)}`);
     let triggerType = event?.triggerType ?? null;
     if(event.path === "/carrier/add"){
       triggerType = 'Add_CARRIERS_API'
     }
     switch (triggerType) {
      
      case 'Add_CARRIERS_API':
       let body = JSON.parse(event.body);
        const tokenValidated = await validateToken(process.env.ENV,body.token)
        // console.log('token validated',tokenValidated)
        let carrierList = [];
        if(tokenValidated){
         let id = body.id.replace('ZONE#','')
         carrierList = await updateCarriers(body.jobs, body, id)
         // console.log('all done')
        }
        return {
          statusCode: 200,
            headers: {
              "Access-Control-Allow-Methods":
                "GET, POST, PUT, PATCH, POST, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
              "Access-Control-Allow-Origin": "*",
            },

            body: JSON.stringify(carrierList),
       };
       // break;
      
      case 'UPDATE_ADD':
        let jobs = event.jobs;
        let newZoneImage = event.newZoneImage;
        let zoneId = event.zoneId.replace('ZONE#','');
        await updateCarriers(jobs, newZoneImage, zoneId)
       break;
      case "UPDATE_ALL_ZONE":
       // to trigger event
       // {
       //  "triggerType": "UPDATE_ALL_ZONE"
       // }
        const zones = await getPaginatedData( 
                {
                  messageNextToken: null , 
                  resData: [], 
                  variables:{
                     cat: 'ZONE'
                  } , 
                  query: dataByCategory,
                  queryName: 'dataByCategory',
                  url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
                  method: 'post'
         })
          for (let zoneitem of zones) {
            await updateDrDeck({
             "id": zoneitem.id,
             "cat": `ZONE`,
             "dd_tenant": `TENANT#${zoneitem.tenant_id}`,
              _version: zoneitem._version,
            })
          }
       break;
      case 'SYNC_ALL_ZONE_CARRIERS':
       // to trigger event
       // {
       //  "triggerType": "SYNC_ALL_ZONE_CARRIERS"
       // }
        const zoneList = await getPaginatedData( 
                {
                  messageNextToken: null , 
                  resData: [], 
                  variables:{
                     cat: 'ZONE'
                  } , 
                  query: dataByCategory,
                  queryName: 'dataByCategory',
                  url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
                  method: 'post'
         })
          for (let zoneitem of zoneList) {
           if(zoneitem._deleted !== true){
          // console.log(zoneitem.id)
          let zoneId = zoneitem.id.replace('ZONE#','');
         
           await updateCarriers(zoneitem.jobs, zoneitem, zoneId)
         }
          }
       break;
      default:
       console.log('Invalid trigger typer')
       // code
     }
     }catch(e){
         console.log('carrier updation failed', e)
     }
 };
 