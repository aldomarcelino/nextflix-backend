const generateSlug = (title) => {
  return title.split(" ").join("-");
};

module.exports = generateSlug;
