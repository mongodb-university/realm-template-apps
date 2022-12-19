exports = function(authEvent) {
    const user = authEvent.user;

    //Access a mongodb service:
    const collection = context.services.get("mongodb-atlas").db("Item").collection("User");
    const newDoc = {
      _id: user.id,
      _owner_id: user.id,
      team: '',
      isTeamAdmin: false
    };
    
    var result = collection.insertOne(newDoc);
    
    console.log(JSON.stringify(result));
    console.log(JSON.stringify(user.custom_data));
};
