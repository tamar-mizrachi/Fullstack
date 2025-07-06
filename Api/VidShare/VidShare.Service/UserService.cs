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
        public async Task<User?> GetByIdAsync(int id)
        {
            return await _irepositoryManager.Users.GetByIdAsync(id);
        }
        public async Task< User> AddAsync(User user)
        {
            var newUser=await _irepositoryManager.Users.AddAsync(user);
            await _irepositoryManager.SaveAsync();
            return newUser;
        }
        public async Task<User> UpdateAsync(User user)
        {
           var newUser= await _irepositoryManager.Users.UpdateAsync(user);
            await _irepositoryManager.SaveAsync();
            return newUser;
        }
        //public void Delete(int id)
        //{
        //    _irepositoryManager.Users.Delete(GetByIdAsync(id));
        //    _irepositoryManager.Save();
        //}
        public async Task DeleteAsync(int id)
        {
            var user = await _irepositoryManager.Users.GetByIdAsync(id);
          await  _irepositoryManager.Users.DeleteAsync(user);
            await _irepositoryManager.SaveAsync();
        }

        public async Task<User> GetByLoginAsync(string name,string password)
        {

            return  await _irepositoryManager.Users.GetByLoginAsync(name,password);
        }
    }
}
