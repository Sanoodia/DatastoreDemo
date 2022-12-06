

const resetzone = (_zoneId) => {
    console.log("reset zone ", _zoneId);
}

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

module.exports = {
    resetzone, isEmpty
  };
  