using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Core.Repositories
{
    public interface IUserRepository
    {
        Task<User> UpdateAsync(User user);
        Task DeleteAsync(int id);
        Task<User?> GetByLoginAsync(int id,string password);
    }
}
