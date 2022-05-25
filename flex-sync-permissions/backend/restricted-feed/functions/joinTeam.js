exports = function(args){
  const userId = args[0];
  const teamName = args[1];
  const isTeamAdmin = args[2]!=null ? args[2] : false;

  var collection = context.services.get("mongodb-atlas").db("Item").collection("User");
    collection.updateOne({_id: userId },{ $set: { team: teamName, isTeamAdmin: isTeamAdmin }});
};