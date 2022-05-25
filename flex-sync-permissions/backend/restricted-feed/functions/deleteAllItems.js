exports = function(arg){

    var collection = context.services.get("mongodb-atlas").db("Item").collection("Item");
    collection.deleteMany({}).then((result) => {
      console.log(result);
    });

return;
};