exports = function(arg){

    var collection = context.services.get("mongodb-atlas").db("Item").collection("User");
    collection.deleteMany({}).then((result) => {
      console.log(result);
    });

return;
};