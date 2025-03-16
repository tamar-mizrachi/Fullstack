using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;
using VidShare.Core.Repozitories;

namespace VidShare.Data.Repozitories
{
    public class UserRepozitory: IUserRepozitory
    {
        private readonly DataContext _context;
        public UserRepozitory(DataContext context)
        {
            _context = context;
        }
        public List<User> GetAll()
        {
            return _context.users;
        }
    }
}
