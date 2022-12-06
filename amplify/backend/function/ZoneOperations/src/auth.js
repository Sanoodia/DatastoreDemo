const auth = function (event) {
  var authorizationHeader = event.headers.Authorization;

  if (!authorizationHeader) return false;

  var encodedCreds = authorizationHeader.split(" ")[1];
  var plainCreds = new Buffer(encodedCreds, "base64").toString().split(":");
  var username = plainCreds[0];
  var password = plainCreds[1];

  if (!(username === "micromerger" && password === "M!cr0m3rger")) return false;
  else return true;
};

module.exports = {
  auth: auth,
};
