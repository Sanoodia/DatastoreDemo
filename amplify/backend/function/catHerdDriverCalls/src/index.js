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
 const axios = require('axios');
 const gql = require('graphql-tag');
 const graphql = require('graphql');
 const { print } = graphql;
const { createCatHerd, updateCatHerd } = require("/opt/graphql/mutations");
const { getCatHerd, databyClassification } = require('/opt/graphql/queries')
const { getPaginatedData } = require("/opt/envHelpers")

const updateTuple = async(query, input) =>{
 try{
   console.log(input)
   const graphqlData = await axios({
     url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
     method: 'post',
     headers: {
     Authorization: 'SUPER_ACCESS_DD'
     },
     data: {
       query: print(gql`${query}`),
       variables: {input: input }
    }
   });
   console.log('zone updated', graphqlData)
 }catch(e){
  console.log('error in updating driver', e)
 }
  
}
const handleAggregation = async(newDriver, oldDriver) =>{
 console.log(newDriver.gsi1sk, oldDriver.gsi1sk)
  try{
    let driverId = newDriver.id.replace('DRIVER#', '')
    let newZone = null, oldZone = null;
    if(newDriver.gsi1sk !== 'ZONE#'){
     const {data} = await axios({
         url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
         method: 'post',
         headers: { Authorization: 'SUPER_ACCESS_DD' },
         data: {
            query: print(gql`${getCatHerd}`),
            variables: {
                   id: newDriver.gsi1sk,
                   cat: 'ZONE'
            }
         }
      });
      newZone = data.data.getCatHerd
    }
    if(oldDriver.gsi1sk !== 'ZONE#'){
     const {data} = await axios({
         url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
         method: 'post',
         headers: { Authorization: 'SUPER_ACCESS_DD' },
         data: {
            query: print(gql`${getCatHerd}`),
            variables: {
                   id: oldDriver.gsi1sk,
                   cat: 'ZONE'
            }
         }
      });
      oldZone = data.data.getCatHerd
    }
      if(newZone !== null){
         let driversList = (newZone.drivers !== '' && newZone.drivers !== null)?newZone.drivers.split(',') : [];
          driversList.push(driverId)
          await updateTuple(updateCatHerd, {
              "id": newZone.id,
              "cat": "ZONE",
              "drivers": driversList.toString(),
              "_version": newZone._version  
           })
      }
      if(oldZone !== null){
         let driversList = (oldZone.drivers !== '' && oldZone.drivers !== null)?oldZone.drivers.split(',') : [];
         driversList = driversList.filter(e => e !== driverId);
         await updateTuple(updateCatHerd, {
              "id": oldZone.id,
              "cat": "ZONE",
              "drivers": driversList.toString(),
              "_version": oldZone._version  
           })
      }
   
  }catch(e){
    console.log('error in aggregation', e)
  }
}

 exports.handler = async (event) => {
     console.log(`EVENT: ${JSON.stringify(event)}`);
     let triggerType = event.triggerType;
     let carriers = event.carriers;
     let zoneId = event.zoneId;
    //  if(triggerType === 'AGGRIGATE_DRIVER'){
    //     await handleAggregation(event.newDriver, event.oldDriver)
    //  }
    //  else if(triggerType === "CREATE" && carriers.length > 0){
    //        const response = await axios({
    //        url: `https://devapi.propdispatch.com/pch/pch_listings/driver?carrier_id=[${carriers}]`,
    //        method: 'GET',
    //        headers: {
    //          'token': '61f3c98567430',
    //          'x-api-key': '7b7aa78f506a40bc0320fa308efc19bf'
    //        }})
          
    //        if(response?.data?.data.length > 0){
    //           console.log(response?.data?.data)
    //           for(let driver of response.data.data){
    //             console.log(driver)
    //                const graphqlData = await axios({
    //                  url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
    //                  method: 'post',
    //                  headers: {
    //                   //  'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
    //                   Authorization: 'SUPER_ACCESS_DD'
    //                  },
    //                  data: {
    //                    query: print(gql`${createCatHerd}`),
    //                    variables: {
    //                      input: {
    //                        "id": `DRIVER#${driver.driver_id}`,
    //                        "driver_name": driver.driver_name,
    //                        "carrier_id": driver.carrier_id,
    //                        "carrier_name": driver.carrier_name,
    //                        "user_id": driver.user_id,
    //                        "on_duty": driver.on_duty,
    //                        "shift": driver.shift,
    //                        "cat": "DRIVER",
    //                        "gsi1sk": `${zoneId}`,
    //                        "type":  `DRIVER_${zoneId}`,
    //                        "is_assigned": false
    //                      }
    //                    }
    //                  }
    //                });
    //            console.log(graphqlData.data)
    //           }
    //        }
    //         return {
    //              statusCode: 200,
    //              body: JSON.stringify('Drivers Added'),
    //         };
    //   }
    //  else 
     if(triggerType === "INACTIVE_ZONE"){
      //update zone
        // updateTuple(updateCatHerd, {
        //       "id": zoneId,
        //       "cat": "ZONE",
        //       "drivers": "",
        //       "_version": event.zone._version  
        // })
        //update driver
        let data = await getPaginatedData(
              {
                messageNextToken: null , 
                resData: [], 
                variables:{classification: "DRIVER", 
                   filter: {gsi1sk: {eq: zoneId}}
                }, 
                query: databyClassification,
                queryName: 'databyClassification',
                url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
                method: 'post'
              }
         )
        
        if(data !== null){
         for(let driver of data){
            let updatedDriver = await updateTuple(updateCatHerd, {
              "id": driver.id,
              "cat": driver.cat,
              "gsi1sk": 'ZONE#',
              "type": "DRIVER_ZONE#",
              "_version": driver._version  
           })
           console.log("driver's zone reset",updatedDriver)
         }
        }
        
     }
     return {
         statusCode: 200,
         body: JSON.stringify('Empty Carriers '),
     };
    
 };
 