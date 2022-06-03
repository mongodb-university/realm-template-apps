exports = async function(userId, subscribeToEmail){

console.log(userId, subscribeToEmail);
    var collection = context.services.get("mongodb-atlas").db("Item").collection("User");
    
    var subscribeToUser = await collection.findOne({"email" : subscribeToEmail});
    
    console.log(JSON.stringify(subscribeToUser));
    
    var result = collection.updateOne({ _id: userId }, { $addToSet: { "subscribedTo": subscribeToUser._id } });
   return result;
};