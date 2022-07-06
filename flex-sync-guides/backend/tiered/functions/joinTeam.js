exports = async function(userId, teamName, isAdmin = false){

    var collection = context.services.get("mongodb-atlas").db("Item").collection("User");
    
      const filter = { _id: userId };
      const update = { $set: { team: teamName, isTeamAdmin: isAdmin }};
      const options = { upsert: false };
      let result = await collection.updateOne(filter, update, options);
  
  return result;
};