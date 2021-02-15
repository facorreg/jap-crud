const promesify = (shouldResolve, ret) => {
  if (shouldResolve) return Promise.resolve(ret);
  return Promise.reject(new Error(ret));
};

export default promesify;
