﻿using System;
using MongoDB.Bson;
using Realms;

namespace RealmTodo.Models
{
    public partial class Item : IRealmObject
    {
        [PrimaryKey]
        [MapTo("_id")]
        public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

        [MapTo("owner_id")]
        [Required]
        public string OwnerId { get; set; }

        [MapTo("summary")]
        [Required]
        public string Summary { get; set; }

        [MapTo("isComplete")]
        public bool IsComplete { get; set; }
    }
}
