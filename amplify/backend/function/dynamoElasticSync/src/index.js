const AWS = require("aws-sdk");
var region = process.env.AWS_REGION;
var es_type = "episodes";

const { getESDomain } = require("/opt/envHelpers");
var domain = getESDomain(process.env.ENV);

const generateId = (data) => {
  if (data.classification === "LOAD" || data.classification === "JOB")
    return data.id.replace(/#/g, "") + "T" + data.tenant_id;
  else return data.id.replace(/#/g, "");
  // if (data.classification === "DRIVER")
  //   return (
  //     data.id.replace("DRIVER#", "D") +
  //     "T" +
  //     data.tenant_id +
  //     "C" +
  //     data.carrier_id
  //   );
  // else
};

const findIndex = (id) => {
  switch (id) {
    case "DRIVER":
      return "drivers";
    case "LOAD":
      return "loads";
    case "CT":
      return "targets";
    case "JOB":
      return "jobs";
    case "ZONE":
      return "zones";
    default:
      return "invalid";
  }
};

const removeDocument = async (document) => {
  try {
    //creating a request body
    var endpoint = new AWS.Endpoint(domain); //creating Endpoint
    var request = new AWS.HttpRequest(endpoint, region); //creating request body with endpoint and region
    request.method = "DELETE"; // method PUT, POST, GET & Delete
    var convertedDoc = AWS.DynamoDB.Converter.unmarshall(document);
    request.path +=
      findIndex(convertedDoc.id.split("#")[0]) +
      "/" +
      es_type +
      "/" +
      generateId(convertedDoc);

      let version = convertedDoc._version;
      delete convertedDoc._version;
      convertedDoc.version = version;
    request.body = JSON.stringify(convertedDoc);

    request.headers["host"] = domain;
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

const updateDocument = async (document) => {
  try {
    //creating a request body
    var endpoint = new AWS.Endpoint(domain); //creating Endpoint
    var request = new AWS.HttpRequest(endpoint, region); //creating request body with endpoint and region
    request.method = "PUT"; // method PUT, POST, GET & Delete

    var convertedDoc = AWS.DynamoDB.Converter.unmarshall(document);
    request.path +=
      findIndex(convertedDoc.id.split("#")[0]) +
      "/" +
      es_type +
      "/" +
      generateId(convertedDoc);
      let version = convertedDoc._version;
      delete convertedDoc._version;
      convertedDoc.version = version;
    request.body = JSON.stringify(convertedDoc);
    request.headers["host"] = domain;
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
const deleteIndice = async (indice) => {
  console.log("deleteIndice");
  try {
    //creating a request body
    var endpoint = new AWS.Endpoint(domain); //creating Endpoint
    var request = new AWS.HttpRequest(endpoint, region); //creating request body with endpoint and region
    request.method = "DELETE"; // method PUT, POST, GET & Delete

    request.path += indice;
    request.headers["host"] = domain;
    request.headers["Content-Type"] = "application/json";
    request.headers["Content-Length"] = Buffer.byteLength(request.body);

    console.log("request path", request);
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
exports.handler = async (events) => {
  let finalResponse = [];
  const { Records } = events;
  for (let i = 0; i < Records.length; i++) {
    let document = Records[i].dynamodb.NewImage;

    if (Records[i].eventName === "REMOVE" || document?._deleted?.BOOL) {
      finalResponse.push(await removeDocument(Records[i].dynamodb.OldImage));
    } else {
      finalResponse.push(await updateDocument(Records[i].dynamodb.NewImage));
    }
  }
  // finalResponse.push(await deleteIndice("loads"));
  // finalResponse.push(await deleteIndice("jobs"));

  return finalResponse;
};
