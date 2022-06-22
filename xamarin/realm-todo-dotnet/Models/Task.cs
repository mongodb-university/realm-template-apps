
using MongoDB.Bson;
using Realms;

namespace RealmTemplateApp.Models
{
    public class Task : RealmObject
    {
        [PrimaryKey]
        [Required]
        [MapTo("_id")]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

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
