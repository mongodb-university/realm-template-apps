exports = function(arg) {
  const collection = context.services.get("mongodb-atlas").db("Item").collection("Item");
  return collection.deleteMany({}).then((result) => {
    console.log(result);
  });
};
