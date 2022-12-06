const aws = require("aws-sdk");
const ses = new aws.SES({ region: "us-east-1" });
const axios = require("axios");
const moment = require("moment");

async function createEmailTemplate() {
  const logoUrl =
    "https://driverdeck-public-assets.s3.amazonaws.com/assets/dd-logo.png";
  const checkedinUrl =
    "https://driverdeck-public-assets.s3.amazonaws.com/assets/checkedin.png";
  const totalDriversUrl =
    "https://driverdeck-public-assets.s3.amazonaws.com/assets/total-drivers.png";
  const assignedUrl =
    "https://driverdeck-public-assets.s3.amazonaws.com/assets/assigned.png";

  var emailTemplateParams = {
    Template: {
      TemplateName: "dd_shift_email",
      HtmlPart: `<!DOCTYPE HTML
            PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
            <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="x-apple-disable-message-reformatting">
            <!--[if !mso]><!-->
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <!--<![endif]-->
            <title></title>
        
            <style type="text/css">
                @media only screen and (min-width: 520px) {
                    .u-row {
                        width: 500px !important;
                    }
                    .u-row .u-col {
                        vertical-align: top;
                    }
                    .u-row .u-col-33p33 {
                        width: 166.65px !important;
                    }
                    .u-row .u-col-33p34 {
                        width: 166.7px !important;
                    }
                    .u-row .u-col-100 {
                        width: 500px !important;
                    }
                }
                
                @media (max-width: 520px) {
                    .u-row-container {
                        max-width: 100% !important;
                        padding-left: 0px !important;
                        padding-right: 0px !important;
                    }
                    .u-row .u-col {
                        min-width: 320px !important;
                        max-width: 100% !important;
                        display: block !important;
                    }
                    .u-row {
                        width: calc(100% - 40px) !important;
                    }
                    .u-col {
                        width: 100% !important;
                    }
                    .u-col>div {
                        margin: 0 auto;
                    }
                }
                
                body {
                    margin: 0;
                    padding: 0;
                }
                
                table,
                tr,
                td {
                    vertical-align: top;
                    border-collapse: collapse;
                }
                
                p {
                    margin: 0;
                }
                
                .ie-container table,
                .mso-container table {
                    table-layout: fixed;
                }
                
                * {
                    line-height: inherit;
                }
                
                a[x-apple-data-detectors='true'] {
                    color: inherit !important;
                    text-decoration: none !important;
                }
                
                table,
                td {
                    color: #000000;
                }
                
                #u_body a {
                    color: #0000ee;
                    text-decoration: underline;
                }
            </style>
        
        
        
        </head>
        
        <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e7e7e7;color: #000000">
            <!--[if IE]><div class="ie-container"><![endif]-->
            <!--[if mso]><div class="mso-container"><![endif]-->
            <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%" cellpadding="0" cellspacing="0">
                <tbody>
                    <tr style="vertical-align: top">
                        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e7e7e7;"><![endif]-->
        
        
                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
        
                                        <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color: #ffffff;width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                                            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                    <!--<![endif]-->
        
                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word; padding: 22px 29px;font-family:arial,helvetica,sans-serif;" align="left">
        
                                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                        <tr>
                                                                            <td align="center">
        
        
                                                                                <img src="${logoUrl}">
        
                                                                            </td>
                                                                        </tr>
                                                                    </table>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                    </div>
                                </div>
                            </div>
        
        
        
                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
        
                                        <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color: #000000;width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                                            <div style="background-color: #000000;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                    <!--<![endif]-->
        
                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;font-family:arial,helvetica,sans-serif;    padding: 10px 7px;" align="left">
        
                                                                    <div style="color: #ecf0f1; line-height: 180%; text-align: center; word-wrap: break-word;">
                                                                        <p style="font-size: 14px; line-height: 180%;"><span style="font-size: 16px; line-height: 28.8px;"><strong>{{shift}} has started with
                                                                                    {{customer_name}}</strong></span></p>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                    </div>
                                </div>
                            </div>
        
        
        
                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
        
                                        <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color: #ffffff;width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                                            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                    <!--<![endif]-->
        
                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding: 0px 23px;font-family:arial,helvetica,sans-serif;" align="left">
        
                                                                    <div style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                        <p style="font-size: 14px; line-height: 140%;"> </p>
                                                                        <p style="font-size: 14px; line-height: 140%;">{{contact_name}},
                                                                        </p>
                                                                        <p style="font-size: 14px; line-height: 140%;"> </p>
                                                                        <p style="font-size: 14px; line-height: 140%;">The {{shift}} has started as of {{shift_time}} CST for {{customer_name}}. This email shows you where your drivers stand for this shift. To get live details, please click the link below to
                                                                            open your shift page.</p>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                    </div>
                                </div>
                            </div>
        
        
        
                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
        
                                        <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color: #ffffff;width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                                            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                    <!--<![endif]-->
        
                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:22px 22px;font-family:arial,helvetica,sans-serif;" align="left">
        
                                                                    <div align="center">
                                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:arial,helvetica,sans-serif;"><tr><td style="font-family:arial,helvetica,sans-serif;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:45px; v-text-anchor:middle; width:163px;" arcsize="9%" stroke="f" fillcolor="#34495e"><w:anchorlock/><center style="color:#FFFFFF;font-family:arial,helvetica,sans-serif;"><![endif]-->
                                                                        <a href="https://{{env}}driverdeck.app/happeningNow/?zone={{zone_id}}/?carrier={{target_carrier_id}}/?tenant={{target_tenant_id}}" target="_blank" style="cursor:pointer;box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #314254; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
                                                                            <span style="display:block;
                                                                             padding: 8px 22px;
                                                                            line-height:180%;">
                                                                                <p style="font-size: 14px; line-height: 180%;">
                                                                                    <strong><span
                                                                                            style="font-size: 14px; line-height: 25.2px;">View
                                                                                            Driver Status</span></strong>
                                                                            </p>
                                                                            </span>
                                                                        </a>
                                                                        <!--[if mso]></center></v:roundrect></td></tr></table><![endif]-->
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;    padding: 0px 28px;font-family:arial,helvetica,sans-serif;" align="left">
        
                                                                    <div style="line-height: 140%; text-align: left; word-wrap: break-word;">
                                                                        <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 16px; line-height: 22.4px;"><strong>Current
                                                                                    Shift Status: {{action_item_text}}</strong></span></p>
                                                                        <p style="font-size: 14px; line-height: 140%;"> </p>
                                                                        <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 16px; line-height: 22.4px;">•
                                                                                {{checkin_text}}</span>
                                                                        </p>
                                                                        <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 16px; line-height: 22.4px;">•
                                                                                {{assigned_target_text}}</span></p>
                                                                        <p style="font-size: 14px; line-height: 140%;"> </p>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                    </div>
                                </div>
                            </div>
        
        
        
                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
        
                                        <!--[if (mso)|(IE)]><td align="center" width="166" style="background-color: #ffffff;width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                        <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
                                            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                    <!--<![endif]-->
        
                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:20px 20px 5px;font-family:arial,helvetica,sans-serif;" align="left">
        
                                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                        <tr>
                                                                            <td style="padding-right: 0px;padding-left: 0px;" align="center">
        
                                                                                <img align="center" border="0" src="${checkedinUrl}" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 46px;border-radius: 4px;"
                                                                                    width="46" />
        
                                                                            </td>
                                                                        </tr>
                                                                    </table>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                        <!--[if (mso)|(IE)]><td align="center" width="166" style="background-color: #ffffff;width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                        <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
                                            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                    <!--<![endif]-->
        
                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:20px 20px 5px;font-family:arial,helvetica,sans-serif;" align="left">
        
                                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                        <tr>
                                                                            <td style="padding-right: 0px;padding-left: 0px;" align="center">
        
                                                                                <img align="center" border="0" src="${assignedUrl}" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 48px;"
                                                                                    width="48" />
        
                                                                            </td>
                                                                        </tr>
                                                                    </table>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                        <!--[if (mso)|(IE)]><td align="center" width="166" style="background-color: #ffffff;width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                        <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
                                            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                    <!--<![endif]-->
        
                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:20px 20px 5px;font-family:arial,helvetica,sans-serif;" align="left">
        
                                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                        <tr>
                                                                            <td style="padding-right: 0px;padding-left: 0px;" align="center">
        
                                                                                <img align="center" border="0" src="${totalDriversUrl}" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 49px;"
                                                                                    width="49" />
        
        
                                                                            </td>
                                                                        </tr>
                                                                    </table>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                    </div>
                                </div>
                            </div>
        
        
        
                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
        
                                        <!--[if (mso)|(IE)]><td align="center" width="166" style="background-color: #ffffff;width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                        <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.65px;display: table-cell;vertical-align: top;">
                                            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                    <!--<![endif]-->
        
                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
        
                                                                    <div style="line-height: 140%; text-align: center; word-wrap: break-word;">
                                                                        <p style="font-size: 14px; line-height: 140%;">
                                                                            <strong>Drivers Checked In</strong></p>
                                                                        <p style="font-size: 14px; line-height: 140%;"> </p>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                        <!--[if (mso)|(IE)]><td align="center" width="166" style="background-color: #ffffff;width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                        <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.65px;display: table-cell;vertical-align: top;">
                                            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                    <!--<![endif]-->
        
                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
        
                                                                    <div style="line-height: 140%; text-align: center; word-wrap: break-word;">
                                                                        <p style="font-size: 14px; line-height: 140%;">
                                                                            <strong>Drivers Assigned</strong></p>
                                                                        <p style="font-size: 14px; line-height: 140%;"> </p>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                        <!--[if (mso)|(IE)]><td align="center" width="166" style="background-color: #ffffff;width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                        <div class="u-col u-col-33p34" style="max-width: 320px;min-width: 166.7px;display: table-cell;vertical-align: top;">
                                            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                    <!--<![endif]-->
        
                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
        
                                                                    <div style="color: #000000; line-height: 140%; text-align: center; word-wrap: break-word;">
                                                                        <p style="font-size: 14px; line-height: 140%;">
                                                                            <strong>Total<span
                                                                                    style="background-color: #ecf0f1; font-size: 14px; line-height: 19.6px;">
                                                                                </span>Drivers Needed</strong></p>
                                                                        <p style="font-size: 14px; line-height: 140%;"> </p>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                    </div>
                                </div>
                            </div>
        
        
        
                            <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
        
                                        <!--[if (mso)|(IE)]><td align="center" width="166" style="background-color: #ffffff;width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                        <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
                                            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                    <!--<![endif]-->
        
                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
        
                                                                    <div style="line-height: 140%; text-align: center; word-wrap: break-word;">
                                                                        <p style="font-size: 14px; line-height: 140%;">
                                                                            <strong>{{checkedin_drivers}}</strong></p>
                                                                        <p style="font-size: 14px; line-height: 140%;"> </p>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                        <!--[if (mso)|(IE)]><td align="center" width="166" style="background-color: #ffffff;width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                        <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
                                            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                    <!--<![endif]-->
        
                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
        
                                                                    <div style="line-height: 140%; text-align: center; word-wrap: break-word;">
                                                                        <p style="font-size: 14px; line-height: 140%;">
                                                                            <strong>{{actual_drivers}}</strong></p>
                                                                        <p style="font-size: 14px; line-height: 140%;"> </p>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                        <!--[if (mso)|(IE)]><td align="center" width="166" style="background-color: #ffffff;width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                        <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
                                            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                <!--[if (!mso)&(!IE)]><!-->
                                                <div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                                    <!--<![endif]-->
        
                                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
        
                                                                    <div style="line-height: 140%; text-align: center; word-wrap: break-word;">
                                                                        <p style="font-size: 14px; line-height: 140%;">
                                                                            <strong>{{target_drivers}}</strong></p>
                                                                        <p style="font-size: 14px; line-height: 140%;"> </p>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                </div>
                                                <!--<![endif]-->
                                            </div>
                                        </div>
                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                    </div>
                                </div>
                            </div>
        
        
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table>
            <!--[if mso]></div><![endif]-->
            <!--[if IE]></div><![endif]-->
        </body>
        
        </html>`,
      SubjectPart: "DriverDeck - Zone Shift Timing Alert",
    },
  };

  ses.updateTemplate(emailTemplateParams, function (err, data) {
    if (err) console.log("unable to create email template", err, err.stack);
    // an error occurred
    else console.log("email template created", data); // successful response
  });
}

const getDriversInfo = async (zone, target) => {
  try {
    const response = await axios.post(`https://${process.env.API_DYNAMOELASTICSYNCAPI_APIID}.execute-api.us-east-1.amazonaws.com/${process.env.ENV}/search`, {
      action_type: "OPEN_URL_CARRIER_INFO",
      zone_id: zone?.id?.replace("ZONE#", ""),
      carrier_id: target.carrier_id,
    });
    if (response.status === 200) return response.data;
    else console.log("Error! Unable to get drivers info");
  } catch (e) {
    console.log("Error! Unable to get drivers info", e);
  }
};

const sendEmail = async ({ env, shift, zone, target, users }) => {
  // await createEmailTemplate();
  const driversInfo = await getDriversInfo(zone, target);

  const actionItemText =
    driversInfo[shift].stats.assigned === driversInfo[shift].stats.targets &&
    driversInfo[shift].stats.checkedIn === driversInfo[shift].stats.assigned
      ? "No Action Required at this time"
      : "Action Required";

  const checkinText =
    driversInfo[shift].stats.checkedIn === driversInfo[shift].stats.assigned
      ? "All drivers are checked in"
      : "Some drivers have still not checked in";

  const assignedTargetText =
    driversInfo[shift].stats.assigned === driversInfo[shift].stats.targets
      ? "Your customer has all of the drivers they need"
      : "Your customer still needs more drivers";

  const shiftTime = moment
    .utc(
      shift === "AM" ? zone.am_shift_start_time : zone.pm_shift_start_time,
      "HH:mm:ss"
    )
    .subtract(5, "h")
    .format("HH:mm");
  const dest = await users.map((user) => ({
    Destination: {
      ToAddresses: [user.email],
    },
    ReplacementTemplateData: JSON.stringify({
      shift: shift,
      customer_name: zone.tenant_name,
      shift_time: shiftTime,
      env: env,
      zone_id: zone?.id?.replace("ZONE#", ""),
      target_carrier_id: target.carrier_id,
      target_tenant_id: target.tenant_id,
      action_item_text: actionItemText,
      checkin_text: checkinText,
      assigned_target_text: assignedTargetText,
      checkedin_drivers: driversInfo[shift].stats.checkedIn,
      actual_drivers: driversInfo[shift].stats.actual,
      target_drivers: driversInfo[shift].stats.targets,
      contact_name: user.name,
    }),
  }));

  var params = {
    Destinations: dest,
    Source: "info@propdispatch.com",
    Template: "dd_shift_email",
    DefaultTemplateData: JSON.stringify({
      shift: "null",
      customer_name: "null",
      shift_time: "null",
      env: "null",
      zone_id: "null",
      target_carrier_id: "null",
      target_tenant_id: "null",
      action_item_text: "null",
      checkin_text: "null",
      assigned_target_text: "null",
      checkedin_drivers: "null",
      actual_drivers: "null",
      target_drivers: "null",
      contact_name: "null",
    }),
  };

  await ses
    .sendBulkTemplatedEmail(params)
    .promise()
    .then((resp) => {
      console.log("Send Bulk Email Response:", resp);
    })
    .catch((err) => {
      console.log("Unable to send email", err);
    });
};

module.exports = {
  sendEmail,
};
