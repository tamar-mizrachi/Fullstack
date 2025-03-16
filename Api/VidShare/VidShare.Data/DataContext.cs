using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Data
{
    public class DataContext
    {
        public List<User> users { get; set; }

        public DataContext()
        {
            users = new List<User>
            {
                new User { Id = 1, Name = "name", Email = "name@gmail.com" }
            };
        }
    }
}
