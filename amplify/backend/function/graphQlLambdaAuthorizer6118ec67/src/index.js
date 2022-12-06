// This is sample code. Please update this to suite your schema

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
 const { getPdBaseUrl } = require("/opt/envHelpers")
 const axios = require('axios');
 
 exports.handler = async (event) => {
   
  // console.log(`EVENT: ${JSON.stringify(event)}`);
  const {
    authorizationToken,
    requestContext: { apiId, accountId },
  } = event;
  
  
  console.log("Giving access to token: ", authorizationToken);
  let isAuthorized = false;
  let response = {};
  if(authorizationToken == "SUPER_ACCESS_DD"){
    isAuthorized= true;
    
    response = {
    isAuthorized: isAuthorized,
    resolverContext: {
      userid: 'user-id',
      info: 'contextual information A',
      more_info: 'contextual information B'
    },
    deniedFields: [
      `arn:aws:appsync:${process.env.AWS_REGION}:${accountId}:apis/${apiId}/types/Event/fields/comments`,
      `Mutation.createEvent`,
    ],
    ttlOverride: 300,
  };
    
  } else {
      let baseUrl = getPdBaseUrl(process.env.ENV)
  const validateRes = await axios({
      url: `${baseUrl}/user/tokenValidator`,
      method: 'GET',
      headers: {
        "token":authorizationToken,
        "type":"2",
        "X-API-KEY": "7b7aa78f506a40bc0320fa308efc19bf"
      }
  });
  
  response = {
    isAuthorized: true,
    resolverContext: {
      userid: 'user-id',
      info: 'contextual information A',
      more_info: 'contextual information B',
      company_id: validateRes?.data?.data?.company_id
    },
    deniedFields: [
      `arn:aws:appsync:${process.env.AWS_REGION}:${accountId}:apis/${apiId}/types/Event/fields/comments`,
      `Mutation.createEvent`,
    ],
    ttlOverride: 300,
  };
  }
  // console.log(authorizationToken === 'custom-authorized')

  // console.log(validateRes.data.status)
  
  
  // console.log(`response >`, JSON.stringify(response, null, 2));
  return response;
};