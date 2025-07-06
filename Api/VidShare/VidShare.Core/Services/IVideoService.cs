using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Core.Services
{
    public interface IVideoService
    {
        Task<IEnumerable<Video>> GetAllAsync();
        Task<Video> GetByIdAsync(int UserId);
        Task<Video> AddAsync(Video video);
        Task<Video> UpdateAsync(Video video);
        Task DeleteAsync(int id);
        Task<List<Video>> GetByUserIdAsync(int userId);
    }
}
