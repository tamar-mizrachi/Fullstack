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
        Task<Category> UpdateAsync(Category category);
        Task DeleteAsync(int id);
        Task ResetIdentityIfTableEmptyAsync();

    }
}
