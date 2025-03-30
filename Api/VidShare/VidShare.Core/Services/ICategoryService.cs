using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Core.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllAsync();
        Category? GetById(int id);
        Task<Category> AddAsync(Category category);
        Category Update(Category category);
        void Delete(int id);
    }
}
