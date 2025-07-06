using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.DTOs;
using VidShare.Core.Models;

namespace VidShare.Core
{
    public class Mapping
    {
        public UserDTO MappingUserDTO(User user)
        {
            return new UserDTO { Id = user.Id, Name = user.Name, Email = user.Email, Password = user.Password, Role = user.Role };
        }
    }
}
