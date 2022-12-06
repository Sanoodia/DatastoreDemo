/* Amplify Params - DO NOT EDIT
	API_CATHERD_CATHERDTABLE_ARN
	API_CATHERD_CATHERDTABLE_NAME
	API_CATHERD_GRAPHQLAPIENDPOINTOUTPUT
	API_CATHERD_GRAPHQLAPIIDOUTPUT
	API_CATHERD_GRAPHQLAPIKEYOUTPUT
	API_DYNAMOELASTICSYNCAPI_APIID
	API_DYNAMOELASTICSYNCAPI_APINAME
	ENV
	REGION
Amplify Params - DO NOT EDIT *//*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["TWILIO_AUTH_TOKEN","TWILIO_ACCOUNT_SID","TWILIO_NOTIFY_SERVICE_SID"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
const aws = require("aws-sdk");
const helper = require("./helper");
const { sendEmail } = require("./emailConfig");
const { sendMessage } = require("./messageConfig");

exports.handler = async function (event) {
  let { zone, shift } = event;
  let targets = await helper.getAllTargetsByZone({
    classification: "TARGET",
    filter: {
      gsi1sk: { eq: zone.id },
    },
  });

  for (let target of targets) {
    let emailReciverList = [];
    let smsReciverList = [];
    //get emails of the users that will recieve shift alert email
    if (Array.isArray(target.shift_alert_email)) {
      target.shift_alert_email.forEach((info) => {
        info.email &&
          emailReciverList.push({ email: info.email, name: info.name });
      });
    }
    //get phone numbers of the users that will recieve shift alert sms
    if (Array.isArray(target.shift_alert_sms)) {
      target.shift_alert_sms.forEach((info) => {
        info.phone_no && smsReciverList.push(info.phone_no);
      });
    }
    //filter out the emails and phone numbers from custom contacts
    if (Array.isArray(target.custom_contact)) {
      target.custom_contact.forEach((info) => {
        info?.type === "Email" &&
          emailReciverList.push({ email: info.value, name: info.reference });
        info?.type === "SMS" && smsReciverList.push(info.value);
      });
    }

    //get to create the environment link
    let env =
      process.env.ENV === "live"
        ? ""
        : process.env.ENV === "stage"
        ? "play."
        : "dev.";

    if (emailReciverList.length > 0) {
      await sendEmail({ env, shift, zone, target, users: emailReciverList });
    }

    if (smsReciverList.length > 0) {
      await sendMessage({ env, shift, zone, target, users: smsReciverList });
    }
  }
};
