exports = function(authEvent) {
    const user = authEvent.user;

    const collection = context.services.get("mongodb-atlas").db("Item").collection("User");
    const newDoc = {
      _id: user.id,
      email: user.data.email,
      subscribedTo:[]
    };
    return collection.insertOne(newDoc);
};
