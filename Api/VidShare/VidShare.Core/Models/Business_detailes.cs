using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VidShare.Core.Models
{
    public class Business_detailes
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public string ?Address { get; set; }
        public string ?City { get; set; }
        public string ?Phone {  get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }

    }
}
