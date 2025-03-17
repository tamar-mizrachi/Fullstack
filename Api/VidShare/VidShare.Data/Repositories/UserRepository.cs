using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;
using VidShare.Core.Repositories;

namespace VidShare.Data.Repositories
{
    public class UserRepository: IUserRepository
    {
        private readonly DataContext _context;
        public UserRepository(DataContext context)
        {
            _context = context;
        }
        public List<User> GetAll()
        {
            return _context.users.ToList();
        }
        public User? GetById(int id)
        {
            return _context.users.FirstOrDefault(x => x.Id == id);
        }
        public User Add(User user)
        {
            _context.users.Add(user);
            return user;
        }
        public User Update(User admin)
        {
            var existingUser = GetById(admin.Id);
            if(existingUser is null)
            {
                throw new Exception("User not found");
            }
            existingUser.Name = admin.Name;
            existingUser.Email= admin.Email;
            return existingUser;
        }
        public void Delete(int id)
        {
            var existingUser = GetById(id);
            if(existingUser is not  null) 
            { 
                _context.users.Remove(existingUser);
            }
        }
    }
}
