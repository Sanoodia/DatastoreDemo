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
const AWS = require("aws-sdk");
let myDocClient = new AWS.DynamoDB();
const helpers = require("helper");
//  {
//   "action": "DELETE_LOADS",
//   "invoke": "TEST"
// }
//  {
//   "action": "FIX_DELIVERD",
//   "invoke": "TEST"
// }
exports.handler = async (event) => {
  // console.log(`EVENT: ${JSON.stringify(event)}`);
  let resp;
  switch (event.action) {
    case "SET_JOB_ZONE": {
      const allJobs = await helpers.getAllData({
        KeyConditionExpression: "classification = :cs",
        ExpressionAttributeValues: {
          ":cs": "JOB",
        },
        IndexName: "byClass",
      });
      const deleteAllJobs = allJobs.map((_data) => {
        return helpers.deleteItem({
          id: _data.id,
          cat: _data.cat,
        });
      });
      resp = await Promise.all(deleteAllJobs);
      // console.log("0: ",allJobs);
      break;
    }
    case "DELETE_JOBS":
      const allJobs = await helpers.getAllData({
        KeyConditionExpression: "classification = :cs",
        ExpressionAttributeValues: {
          ":cs": "JOB",
        },
        IndexName: "byClass",
      });
      const deleteAllJobs = allJobs.map((_data) => {
        return helpers.deleteItem({
          id: _data.id,
          cat: _data.cat,
        });
      });
      resp = await Promise.all(deleteAllJobs);
      // console.log("1: ",allJobs);
      break;
    case "DELETE_ZONE":
      const allZones = await helpers.getAllData({
        KeyConditionExpression: "cat = :cs",
        ExpressionAttributeValues: {
          ":cs": "ZONE",
        },
        IndexName: "byCategory",
      });
      // console.log("2: ", allZones)
      const deleteAllZones = allZones.map((_data) => {
        return helpers.deleteItem({
          id: _data.id,
          cat: _data.cat,
        });
      });
      resp = await Promise.all(deleteAllZones);
      break;
    case "DELETE_LOADS":
      const allLoads = await helpers.getAllData({
        KeyConditionExpression: "classification = :cs",
        ExpressionAttributeValues: {
          ":cs": "LOAD",
        },
        IndexName: "byClass",
      });
      // console.log("3: ", allLoads)
      const deleteAllLoads = allLoads.map((_data) => {
        return helpers.deleteItem({
          id: _data.id,
          cat: _data.cat,
        });
      });
      resp = await Promise.all(deleteAllLoads);
      break;
    case "DELETE_DRIVERS":
      const allDrivers = await helpers.getAllData({
        KeyConditionExpression: "classification = :cs",
        ExpressionAttributeValues: {
          ":cs": "DRIVER",
        },
        IndexName: "byClass",
      });
      // console.log("4: ", allDrivers)
      const deleteAllDrivers = allDrivers.map((_data) => {
        return helpers.deleteItem({
          id: _data.id,
          cat: _data.cat,
        });
      });
      resp = await Promise.all(deleteAllDrivers);
      break;
    case "FIX_DELIVERD":
      const allLoadstodelete = await helpers.getLoadsToDelete(event.days);
      for (let i = 0; i <= allLoadstodelete.length; i += 25) {
        let toDelete = allLoadstodelete.slice(i, i + 24);
        let itemList = toDelete.map((item) => {
          return {
            DeleteRequest: {
              Key: {
                id: { S: `LOAD#${item.id}` },
                cat: { S: `LOAD#${item.tenant_id}` },
              },
            },
          };
        });
        var params = {
          RequestItems: {
            [process.env.API_CATHERD_CATHERDTABLE_NAME]: itemList,
          },
        };
        try {
          const lambdaResult = await myDocClient
            .batchWriteItem(params)
            .promise();
          console.log("batch sucessfull", lambdaResult);
        } catch (err) {
          console.log("Unable to delete batch", err, itemList);
        }
      }
      break;
    case "RESET_DRIVERS_ZONE":
      resp = await helpers.resetDriverZone();
    default:
      // code
      console.log("Not gonna do anything");
  }
  return resp;
};
