using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;
using VidShare.Core.Repozitories;
using VidShare.Core.Services;

namespace VidShare.Service
{
    public class UserService:IUserService
    {
        private readonly IUserRepozitory _userRepozitory;
        public UserService(IUserRepozitory userRepozitory)
        {
            _userRepozitory = userRepozitory;
        }
        public List<User> GetList() 
        {
            return _userRepozitory.GetAll();
        }
    }

   
}
