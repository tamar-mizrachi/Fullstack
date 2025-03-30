using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Core.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllAsync();
        User? GetById(int id);
        Task<User> AddAsync(User user);
        User Update(User user);
        void Delete(int id);
        User? GetByLogin(string name,string email);
    }
}
