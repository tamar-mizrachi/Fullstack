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
        User Update(User user);
        void Delete(int id);
        User? GetByLogin(int id,string password);
    }
}
