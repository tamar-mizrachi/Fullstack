using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;
using VidShare.Core.Repositories;

namespace VidShare.Data.Repositories
{
    public class UserRepository: Repository<User>, IUserRepository
    {
        private readonly DataContext _context;
        private readonly DbSet<User> _dbSet;

        public UserRepository(DataContext context):base(context) 
        {
            _context = context;
            _dbSet=_context.Set<User>();
        }
   
     
        public new async Task< User> UpdateAsync(User user)
        {
            var existingUser =await GetByIdAsync(user.Id);
            if(existingUser is null)
            {
                throw new Exception("User not found");
            }
            existingUser.Name = user.Name;
            existingUser.Email= user.Email;
            existingUser.Password = user.Password;
            existingUser.Role = user.Role;
            return existingUser;
        }
        //public void Delete(int id)
        //{
        //    var existingUser = GetByIdAsync(id);
        //    if(existingUser is not  null) 
        //    { 
        //        _context.users.Remove(existingUser);
        //    }
        //}
        public async Task DeleteAsync(int id)
        {
            var existingUser = await GetByIdAsync(id);
            if (existingUser is not null)
            {
                _context.users.Remove(existingUser);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<User?> GetByLoginAsync(int id,string password)
        {
            return _dbSet.Find(id,password);
        }
    }
}
