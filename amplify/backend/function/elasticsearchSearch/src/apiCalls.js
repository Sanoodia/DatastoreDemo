const AWS = require("aws-sdk");

const { getESDomain } = require("/opt/envHelpers");

var domain = getESDomain(process.env.ENV);

 let myDocClient = new AWS.DynamoDB.DocumentClient()
const getSdkPaginatedData = async(param, data) => {
  try {
    const response  = await myDocClient.query(param).promise();
    console.log(response)
    if(response['Items'].length > 0) {
        data = [...data, ...response.Items];
    }

    if (response.LastEvaluatedKey) {
        param.ExclusiveStartKey = response.LastEvaluatedKey;
        return await getSdkPaginatedData(param, data);

    } else {
        return data;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

const searchDocument = async (index, query, api_type) => {
  try {
    //creating a request body
    var endpoint = new AWS.Endpoint(domain); //creating Endpoint
    var request = new AWS.HttpRequest(endpoint, process.env.AWS_REGION); //creating request body with endpoint and region
    request.method = "POST"; // method PUT, POST, GET & Delete
    request.path += index + "/" + api_type;
    request.body = query;
    request.headers["host"] = domain;
    request.headers["Content-Type"] = "application/json";

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
            console.log("Response body: " + responseBody);
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

module.exports = { searchDocument, getSdkPaginatedData };
