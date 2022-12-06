const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { getESDomain } = require("/opt/envHelpers");
var esDomain = getESDomain(process.env.ENV);
var region = process.env.AWS_REGION;
var index = "targets";
var es_type = "episodes";
// Set the parameters
const getTargetsQuery = {
  KeyConditionExpression: "classification = :cs",
  IndexName: "byClass",
  ExpressionAttributeValues: {
    ":cs": "TARGET",
  },
  TableName: process.env.API_CATHERD_CATHERDTABLE_NAME,
};

const insertDocumentBulk = async (data) => {
  try {
    //creating a request body
    var endpoint = new AWS.Endpoint(esDomain); //creating Endpoint
    var request = new AWS.HttpRequest(endpoint, region); //creating request body with endpoint and region
    request.method = "POST"; // method PUT, POST, GET & Delete

    request.path += index + "/" + es_type + "/_bulk";

    request.body = data;
    request.headers["host"] = esDomain;
    request.headers["Content-Type"] = "application/json";
    request.headers["Content-Length"] = Buffer.byteLength(request.body);

    console.log("OpenSearch Request: ", { request });

    //Signing the request with authorized credentails like IAM user or role
    var credentials = new AWS.EnvironmentCredentials("AWS");
    var signer = new AWS.Signers.V4(request, "es");
    signer.addAuthorization(credentials, new Date());

    //http request to the server
    var client = new AWS.HttpClient();
    return new Promise((resolve, reject) => {
      client.handleRequest(
        request,
        null,
        function (response) {
          console.log(response.statusCode + " " + response.statusMessage);
          var responseBody = "";
          response.on("data", function (chunk) {
            responseBody += chunk;
          });
          response.on("end", function (chunk) {
            //console.log('Response body: ' + responseBody);
            resolve(responseBody);
          });
        },
        function (error) {
          console.log("Error: " + error);
          reject(error);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};
exports.handler = async (event) => {
  const { Items: targets } = await dynamodb.query(getTargetsQuery).promise();
  let bulkQuery = [];
  for (let i = 0; i < targets.length; i++) {
    delete targets[i]._version;
    let docId = targets[i].id.replace(/#/g, "");
    bulkQuery.push({
      index: {
        _id: docId,
      },
    });
    bulkQuery.push(targets[i]);
  }
  const bulkQueryNdJson = bulkQuery.map(JSON.stringify).join("\n");
  let temp = bulkQueryNdJson.concat("\n");
  let response = await insertDocumentBulk(temp);

  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
    body: JSON.parse(response),
  };
};
