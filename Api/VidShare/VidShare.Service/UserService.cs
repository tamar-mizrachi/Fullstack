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
        private readonly IRepositoryManager _irepositoryManager ;
        public UserService(IRepositoryManager irepositoryManager)
        {
            _irepositoryManager = irepositoryManager;
        }
        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _irepositoryManager.Users.GetAllAsync();
        }
        public User? GetById(int id)
        {
            return _irepositoryManager.Users.GetById(id);
        }
        public async Task< User> AddAsync(User user)
        {
            var newUser=await _irepositoryManager.Users.AddAsync(user);
            _irepositoryManager.Save();
            return newUser;
        }
        public User Update(User user)
        {
           var newUser= _irepositoryManager.Users.Update(user);
            _irepositoryManager.Save();
            return newUser;
        }
        public void Delete(int id)
        {
            _irepositoryManager.Users.Delete(GetById(id));
            _irepositoryManager.Save();
        }
        public User GetByLogin(string name,string password)
        {

            return  _irepositoryManager.Users.GetByLogin(name,password);
        }
    }
}
