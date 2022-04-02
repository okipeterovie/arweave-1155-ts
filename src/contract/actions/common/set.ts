function set(obj, path, value) {
  let schema = obj;  // a moving reference to internal objects within obj
  let pList = path.split('.');
  let len = pList.length;
  for (let i = 0; i < len - 1; i++) {
    let elem = pList[i];
    if (!schema[elem]) schema[elem] = {}
    schema = schema[elem];
  }

  schema[pList[len - 1]] = value;

  return schema
}
