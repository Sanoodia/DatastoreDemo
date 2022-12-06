// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});

// Create CloudWatchEvents service object
var ebevents = new AWS.EventBridge({ apiVersion: "2015-10-07" });
var lambda = new AWS.Lambda();

const dateToCron = (time) => {
  let t = time.split(":");
  const minutes = t[1];
  const hours = t[0];
  const days = "*";
  const months = "*";
  const dayOfWeek = "?";
  const year = "*";

  return `cron(${minutes} ${hours} ${days} ${months} ${dayOfWeek} ${year})`;
};

exports.handler = async function (event) {
  try {
    console.log(event);
    console.log("Updating rule for zone: ", event.zoneId);

    let data = event;
    let env = process.env.ENV ?? "test";
    data.zoneId = data.zoneId.replace("#", "");

    if (data.triggerType === "SHIFT_MODIFIED") {
      if (!data.zoneId) {
        console.log("No zone id error: ", event);
        return;
      }
      if (data.zone.am_shift_start_time) {
        let amCron = dateToCron(data.zone.am_shift_start_time);
        let am_params = {
          Name: `${env}-${data.zoneId.replace("#", "")}-am`,
          Description: `${data.zoneId} rule`,
          EventBusName: "default",
          ScheduleExpression: amCron,
          Tags: [
            {
              Key: "zone",
              Value: `${data.zoneId}`,
            },
            {
              Key: "tenant_id",
              Value: `${data.zone.tenant_id}`,
            },
          ],
        };
        const am_T = await ebevents.putRule(am_params).promise();
        var am_target_params = {
          Rule: `${env}-${data.zoneId}-am`,
          Targets: [
            {
              Arn: `arn:aws:lambda:us-east-1:118012458843:function:emailBroadcaster-${env}`,
              Id: `emailBroadcaster-${env}`,
              Input: JSON.stringify({ zone: data.zone, shift: "AM" }),
            },
          ],
        };
        const am_R = await ebevents.putTargets(am_target_params).promise();

        console.log("am-params", am_params);
        console.log(am_T, am_R);
      }
      if (data.zone.pm_shift_start_time) {
        let pmCron = dateToCron(data.zone.pm_shift_start_time);
        let pm_params = {
          Name: `${env}-${data.zoneId}-pm`,
          Description: `${data.zoneId} rule`,
          EventBusName: "default",
          ScheduleExpression: pmCron,
          Tags: [
            {
              Key: "zone",
              Value: `${data.zoneId}`,
            },
            {
              Key: "tenant_id",
              Value: `${data.zone.tenant_id}`,
            },
          ],
        };
        console.log("pm-params", pm_params);
        const pm_T = await ebevents.putRule(pm_params).promise();
        var pm_target_params = {
          Rule: `${env}-${data.zoneId}-pm`,
          Targets: [
            {
              Arn: `arn:aws:lambda:us-east-1:118012458843:function:emailBroadcaster-${env}`,
              Id: `emailBroadcaster-${env}`,
              Input: JSON.stringify({ zone: data.zone, shift: "PM" }),
            },
          ],
        };
        const pm_R = await ebevents.putTargets(pm_target_params).promise();
        console.log("pm_T", pm_T, pm_R);
      }
    } else if (data.triggerType === "ZONE_DELETED") {
      let pm_target_params = {
        Ids: [`emailBroadcaster-${env}`],
        Rule: `${env}-${data.zoneId}-pm`,
        Force: true,
      };
      let am_target_params = {
        Ids: [`emailBroadcaster-${env}`],
        Rule: `${env}-${data.zoneId}-am`,
        Force: true,
      };
      let pm_params = {
        Name: `${env}-${data.zoneId}-pm`,
      };

      let am_params = {
        Name: `${env}-${data.zoneId.replace("#", "")}-am`,
      };
      const am_R = await ebevents.removeTargets(am_target_params).promise();
      const pm_R = await ebevents.removeTargets(pm_target_params).promise();
      const am_T = await ebevents.deleteRule(am_params).promise();
      const pm_T = await ebevents.deleteRule(pm_params).promise();
      console.log(am_R, pm_R, am_T, pm_T);
    }
  } catch (err) {
    console.log("email Schedular failed: ", err);
  }
};

//reusable code

// var lambdaPermission = {
//   FunctionName: 'arn:aws:lambda:us-east-1:118012458843:function:emailBroadcaster-alpha',
//   StatementId: `${env}-${data.zoneId.replace("#","")}-am`,
//   Action: 'lambda:*',
//   Principal: 'events.amazonaws.com',
// };
// await lambda.addPermission(lambdaPermission).promise();
// var params = {
//   Name: 'test_demo_event', /* required */
//   Description: 'not working',
//   EventBusName: 'default',
//   ScheduleExpression: "rate(2 minutes)",
//   Tags: [
//     {
//       Key: 'test_email', /* required */
//       Value: 'none' /* required */
//     },
//   ]
// };
// var params = {
//   Rule: "test_demo_event",
//   Targets: [
//     {
//       Arn: "arn:aws:lambda:us-east-1:118012458843:function:emailBroadcaster-alpha",
//       Id: "emailBroadcaster-alpha",
//     },
//   ],
// };

// const data = await ebevents.putTargets(params).promise();
// const data = await ebevents.putRule(params).promise();
