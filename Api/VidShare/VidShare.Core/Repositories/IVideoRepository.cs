using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Core.Repositories
{
    public interface IVideoRepository
    {
        Task<Video> Update(Video video);
        Task DeleteAsync(int id);
        Task<List<Video>> GetByUserIdAsync(int userId);
    }
}
