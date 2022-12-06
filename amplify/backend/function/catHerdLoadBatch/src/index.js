/* Amplify Params - DO NOT EDIT
	API_CATHERD_CATHERDTABLE_ARN
	API_CATHERD_CATHERDTABLE_NAME
	API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT
	API_CATHERD_GRAPHQLAPIIDOUTPUT
	API_CATHERD_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
'use strict';

const axios = require('axios');
const gql = require('graphql-tag');
const graphql = require('graphql');
const _ = require("lodash"); 
const { print } = graphql;
const { updateCatHerd } = require("/opt/graphql/mutations");
const { loadByJobId } = require('/opt/graphql/queries')
const { getPaginatedData } = require("/opt/envHelpers")

const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});


exports.handler = async (event) => {
  
  
  try {
    console.log(event)
    let jobs = event.jobs || null;
    let zoneId = event.zoneId || null;
    let zone = event.zone || null;
    let triggerType = event.triggerType || null
      let body = {}
      if((triggerType === "UPDATE_ADD" || triggerType === "UPDATE_REMOVE") && jobs.length > 0){
        console.log('++-------------------------------------',event)
        let loadsList = []
        for(let job of jobs){
            let data = await getPaginatedData(
              {
                messageNextToken: null , 
                resData: [], 
                variables:(triggerType === "UPDATE_ADD")?{
                      job_id: job, 
                      cat: {eq: `LOAD#${zone.tenant_id}`},
                      filter: {
                        or: [
                          {load_status: {eq: "3"}}, 
                          {load_status: {eq: "0"}}
                        ]
                      }
                      
                    }:{
                      job_id: job, 
                      cat: {eq: `LOAD#${zone.tenant_id}`},
                      filter: {gsi1sk: {eq: zoneId}
                      }
                    }, 
                query: loadByJobId,
                queryName: 'loadByJobId',
                url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
                method: 'post'
              }
            )
            // console.log('res',data)
            if( data !== null){
              for(let load of data){
                loadsList.push(load.id.replace('LOAD#',''))
                // if((load.gsi1sk === "ZONE#" && triggerType === "UPDATE_ADD") || triggerType === "UPDATE_REMOVE"){
                // console.log((triggerType === "UPDATE_ADD")? zoneId :  "ZONE#", load.id)
                  const graphqlData = await axios({
                    url: process.env.API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT,
                    method: 'post',
                    headers: {
                      // 'x-api-key': process.env.API_CATHERD_GRAPHQLAPIKEYOUTPUT
                      Authorization: 'SUPER_ACCESS_DD'
                    },
                      data: {
                        query: print(gql`${updateCatHerd}`),
                        variables: {input: {
                            "id": load.id,
                            "cat": load.cat,
                            "gsi1sk": (triggerType === "UPDATE_ADD")? zoneId :  "ZONE#",
                            "type": (triggerType === "UPDATE_ADD")? `LOAD_${zoneId}` : `LOAD_ZONE#`,
                            "_version": load._version
                              
                          }}
                        
                      }
                    });
                    
                // }
                
              }
              
            }
          
          
        }
        return {
          statusCode: 200,
          body: JSON.stringify({
                message: "successfully deleted todo!"
          }),
          headers: {
              "Access-Control-Allow-Origin": "*",
          }
        }
      }
      return {
        statusCode: 200,
        body: JSON.stringify({
                message: "Jobs are empty "
          }),
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
      }
    
  } catch (err) {
    console.log('error creating todo: ', err);
  } 
}