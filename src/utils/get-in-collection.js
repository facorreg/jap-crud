const getInCollection = (Collection, inArr, field) =>
  Collection.find({ [field || '_id']: { $in: inArr } });

export default getInCollection;
