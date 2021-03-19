using System;
using Realms;

namespace RealmTemplateApp.Models
{
    public class Project : EmbeddedObject
    {
        [MapTo("name")]
        public string Name { get; set; }

        [MapTo("partition")]
        public string Partition { get; set; }

        public Project()
        {

        }

        public Project(string name)
        {
            this.Name = name;
        }
    }
}
