using System;
using System.Collections.Generic;
using MongoDB.Bson;
using Realms;

namespace RealmTemplateApp.Models
{
    public class Task : RealmObject
    {
        [PrimaryKey]
        [MapTo("_id")]
        [Required]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [MapTo("summary")]
        [Required]
        public string Summary { get; set; }

        [MapTo("isComplete")]
        public bool IsComplete { get; set; }
    }
}
