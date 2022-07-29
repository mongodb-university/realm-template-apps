
using MongoDB.Bson;
using Realms;

namespace RealmTemplateApp.Models
{
    public class Item : RealmObject
    {
        [PrimaryKey]
        [MapTo("_id")]
        public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

        // :state-start: partition-based-sync
        [MapTo("_partition")]
        [Required]
        public string Partition { get; set; }
        // :state-end:
        // :state-uncomment-start: flexible-sync
        //[MapTo("owner_id")]
        //[Required]
        //public string OwnerId { get; set; }
        // :state-uncomment-end:flexible-sync

        [MapTo("summary")]
        [Required]
        public string Summary { get; set; }

        [MapTo("isComplete")]
        public bool IsComplete { get; set; }
    }
}
