using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;
using VidShare.Core.Repositories;
using VidShare.Core.Services;

namespace VidShare.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepozitory;
        public UserService(IUserRepository userRepozitory)
        {
            _userRepozitory = userRepozitory;
        }
        public List<User> GetAll()
        {
            return _userRepozitory.GetAll();
        }
        public User? GetById(int id)
        {
            return _userRepozitory.GetById(id);
        }
        public User Add(User user)
        {
            return _userRepozitory.Add(user);
        }
        public User Update(User user)
        {
            return _userRepozitory.Update(user);
        }
        public void Delete(int id)
        {
            _userRepozitory.Delete(id);
        }
    }


}
