/* Amplify Params - DO NOT EDIT
	API_CATHERD_CATHERDTABLE_ARN
	API_CATHERD_CATHERDTABLE_NAME
	API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT
	API_CATHERD_GRAPHQLAPIIDOUTPUT
	API_CATHERD_GRAPHQLAPIKEYOUTPUT
	ENV
	FUNCTION_CATHERDDRIVERCALLS_NAME
	FUNCTION_CATHERDJOBBATCH_NAME
	FUNCTION_CATHERDLOADBATCH_NAME
	FUNCTION_EMAILSCHEDULER_NAME
	REGION
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
	API_CATHERD_CATHERDTABLE_ARN
	API_CATHERD_CATHERDTABLE_NAME
	API_CATHERD_GRAPHQLAPIIDOUTPUT
	ENV
	FUNCTION_CATHERDDRIVERCALLS_NAME
	FUNCTION_CATHERDJOBBATCH_NAME
	FUNCTION_CATHERDLOADBATCH_NAME
	FUNCTION_EMAILSCHEDULER_NAME
	REGION
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
	API_CATHERD_CATHERDTABLE_ARN
	API_CATHERD_CATHERDTABLE_NAME
	API_CATHERD_GRAPHQLAPIIDOUTPUT
	ENV
	FUNCTION_EMAILSCHEDULER_NAME
	REGION
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
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

 const AWS = require("aws-sdk");
 const helpers = require("helpers");
 
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
   console.log('<<< Returning from invokeLambda, with lambdaResult: ', lambdaFunctionName, JSON.stringify(lambdaResult, null, 2));
   return lambdaResult;
};
 
 
 exports.handler = async (event, context) => {
 
 
     // console.log(`EVENT: ${JSON.stringify(event)}`);
 
     // record.eventName = 'INSERT' | 'MODIFY'
 
     for (const record of event.Records) {
         const NewImage = AWS.DynamoDB.Converter.unmarshall(
             record.dynamodb.NewImage
         );
         const OldImage = AWS.DynamoDB.Converter.unmarshall(
             record.dynamodb.OldImage
         );
         let identifier = {}, newImage = {}, oldImage = {};
         identifier = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.Keys)
         newImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage)
         oldImage =  AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage)
         let result = []
         
          /*----------------- Add Loads And Job Whenever Zone Updated----------------------*/
         if(newImage._deleted !== false && identifier.cat === 'ZONE'){
       
            if(newImage['status'] !== oldImage['status'] && newImage['status'] === false){
              console.log('Zone status', newImage['status'])
              let res =  invokeLambda(process.env.FUNCTION_CATHERDDRIVERCALLS_NAME, {'triggerType': 'INACTIVE_ZONE', zoneId: newImage.id, zone: newImage});
              console.log('InActive Zone response',res)
             
            }
            if ((newImage.jobs !==  oldImage.jobs) && (newImage.jobs || oldImage.jobs)){
            console.log(identifier.cat, newImage.id)
            console.log("newImage",newImage)
            console.log("oldImage",oldImage)
            console.log("changed in jobs")
            console.log(newImage.jobs)
            let newJobs = (newImage?.jobs)? newImage.jobs.split(',') : []
            let oldJobs = (oldImage?.jobs)? oldImage.jobs.split(',') : []           
            let newAdded = newJobs.filter(x => !oldJobs.includes(x));
            let oldAdded = oldJobs.filter(x => !newJobs.includes(x));
            
           console.log(newAdded, oldAdded)
           if(newAdded.length > 0){
               console.log("Adding jobs", newAdded)
            result = invokeLambda(process.env.FUNCTION_CATHERDLOADBATCH_NAME, {jobs: newAdded,'triggerType': 'UPDATE_ADD', zoneId: newImage.id, zone: newImage});
            result = invokeLambda(process.env.FUNCTION_CATHERDJOBBATCH_NAME, {jobs: newAdded,'triggerType': 'UPDATE_ADD', zoneId: newImage.id, zone: newImage});
           }
           //For Delete
           if(oldAdded.length > 0){
            console.log('deleting loads and jobs', oldAdded)
            result = invokeLambda(process.env.FUNCTION_CATHERDLOADBATCH_NAME, {jobs: oldAdded,'triggerType': 'UPDATE_REMOVE', zoneId: newImage.id,zone: newImage});
            result = invokeLambda(process.env.FUNCTION_CATHERDJOBBATCH_NAME, {jobs: oldAdded,'triggerType': 'UPDATE_REMOVE', zoneId: newImage.id, zone: newImage});
           }
        
           console.log('result: ', result); 
     }
      
     }
         /*----------------- IF ZONE IS MODIFIED |  Deleted----------------------*/
         if (
             !isEmpty(NewImage) &&
             record.eventName === "MODIFY" &&
             NewImage.cat === "ZONE"
         ) {
             if(record.eventName === "MODIFY"){
               console.log("Zone Modified invoking lambda................", NewImage.z_name);
               let res = await invokeLambda(process.env.FUNCTION_EMAILSCHEDULER_NAME, {'triggerType': 'SHIFT_MODIFIED', zoneId: NewImage.id, zone: NewImage});
               console.log(res)
              
             }
             if (NewImage._deleted === true) {
                 console.log("Zone Deleted................", NewImage.z_name);
                 const reset = await helpers.resetZoneLinks(NewImage.id);
                 console.log("ZONE TO BE SET: ", reset);
                  console.log("Zone Deleted invoking lambda................", NewImage.z_name);
                 let res = await invokeLambda(process.env.FUNCTION_EMAILSCHEDULER_NAME, {'triggerType': 'ZONE_DELETED', zoneId: NewImage.id, zone: NewImage});
                 console.log(res)
             }
             else {
                 console.log("Zone Modified");
                 //TODO: zone modified - may be new jobs added or some removed....
             }
         }
 
         /*----------------- IF Driver  updated ----------------------*/
         if (
             !isEmpty(NewImage) &&
             !isEmpty(OldImage) &&
             NewImage.id.includes("DRIVER#")
         ) {
             console.log("Driver modified...");

             // Driver Tenant updated
             if (NewImage.dd_tenant !== OldImage.dd_tenant) {
                 await helpers.resolveDriverTenant({ NewImage, OldImage });
             }
           
         }
 
     

     }
     return event;
 };
 
 function isEmpty(obj) {
     for (var key in obj) {
         if (obj.hasOwnProperty(key)) return false;
     }
     return true;
 }
 