const aws = require("aws-sdk");
const moment = require("moment");

const sendMessage = async ({ env, shift, zone, target, users }) => {
  const { Parameter: TWILIO_AUTH_TOKEN } = await new aws.SSM()
    .getParameter({
      Name: process.env["TWILIO_AUTH_TOKEN"],
      WithDecryption: true,
    })
    .promise();
  const { Parameter: TWILIO_ACCOUNT_SID } = await new aws.SSM()
    .getParameter({
      Name: process.env["TWILIO_ACCOUNT_SID"],
      WithDecryption: true,
    })
    .promise();
  const { Parameter: TWILIO_NOTIFY_SERVICE_SID } = await new aws.SSM()
    .getParameter({
      Name: process.env["TWILIO_NOTIFY_SERVICE_SID"],
      WithDecryption: true,
    })
    .promise();

  const twilio = require("twilio")(
    TWILIO_ACCOUNT_SID.Value,
    TWILIO_AUTH_TOKEN.Value
  );
  const service = twilio.notify.services(TWILIO_NOTIFY_SERVICE_SID.Value);
  const bindings = users.map((number) => {
    return JSON.stringify({ binding_type: "sms", address: number });
  });

  const shiftTime = moment
    .utc(
      shift === "AM" ? zone.am_shift_start_time : zone.pm_shift_start_time,
      "HH:mm:ss"
    )
    .subtract(5, "h")
    .format("HH:mm");

  const body = `The ${shift} shift has started as of ${shiftTime} CST for ${
    zone.tenant_name
  }. This email shows you where your drivers stand for this shift. To get live details, please click on the link below to open your shift page. \n  https://${env}driverdeck.app/happeningNow/?zone=${zone?.id?.replace(
    "ZONE#",
    ""
  )}/?carrier=${target.carrier_id}/?tenant=${target.tenant_id}`;

  await service.notifications
    .create({
      toBinding: bindings,
      body: body,
    })
    .then((notification) => {
      console.log("SMS send successfully", notification);
    })
    .catch((err) => {
      console.error("Unable to send sms", err);
    });
};
module.exports = {
  sendMessage,
};
