exports = async function (userId, teamName, isAdmin = false) {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("Item").collection("User");

  const filter = { _id: userId };
  const update = {
    $set: {
      team: teamName,
      isTeamAdmin: isAdmin,
    },
  };
  const options = { upsert: false };
  try {
    const result = await collection.updateOne(filter, update, options);
    return result; // e.g. { matchedCount: 1, modifiedCount: 1 }
  } catch (err) {
    throw new Error(`Failed to join team: ${err}`);
  }
};
