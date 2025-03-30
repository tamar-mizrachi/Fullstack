using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Core.Repositories
{
    public interface ICategoryRepository
    {
        Category Update(Category category);
        void Delete(int id);
    }
}
