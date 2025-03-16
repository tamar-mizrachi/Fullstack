using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Core.Repozitories
{
    public interface IUserRepozitory
    {
        List<User> GetAll();
    }
}
