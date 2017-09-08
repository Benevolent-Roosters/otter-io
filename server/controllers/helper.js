module.exports.checkUndefined = () => {
  var inputArray = Array.prototype.slice.call(arguments);
  var anyUndefined = false;
  inputArray.forEach((eachInput) => {
    if (eachInput === undefined) {
      anyUndefined = true;
    }
  });
  return anyUndefined;
};