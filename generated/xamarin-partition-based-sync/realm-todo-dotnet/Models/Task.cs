
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

        [MapTo("_partition")]
        [Required]
        public string Partition { get; set; }

        [MapTo("summary")]
        [Required]
        public string Summary { get; set; }

        [MapTo("isComplete")]
        public bool IsComplete { get; set; }
    }
}
