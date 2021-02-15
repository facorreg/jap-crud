import filterEmpty from './filter-empty';

const insertMany = async (Collection, arr, duplicateHandler = () => null) => {
  try {
    const inserted = arr.map(async (el) => {
      try {
        const newElem = await new Collection(el);
        await newElem.save();
        // eslint-disable-next-line no-underscore-dangle
        return Promise.resolve(newElem._id);
      } catch (err) {
        if (err.code !== 11000) {
          return Promise.reject(err);
        }
        // eslint-disable-next-line no-underscore-dangle
        return Promise.resolve(duplicateHandler(el)?._id);
      }
    });
    const insertedIds = filterEmpty(await Promise.all(inserted));

    return Promise.resolve({ insertedIds });
  } catch (err) {
    return Promise.reject(err);
  }
};

export default insertMany;
