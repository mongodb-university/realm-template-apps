exports = async function(email) {
  const collection = context.services.get("mongodb-atlas").db("Item").collection("User");
  
  // Look up the author object to get the user id from an email
  const author = await collection.findOne({email});
  if (author == null) {
    return {error: `Author ${email} not found`};
  }
  
  // Whoever called this function is the would-be subscriber
  const subscriber = context.user;

  try {
    return await collection.updateOne(
      {_id: subscriber.id},
      {$addToSet: {
          subscribedTo: author._id,
        }
      });
  } catch (error) {
    return {error: error.toString()};
  }
};
