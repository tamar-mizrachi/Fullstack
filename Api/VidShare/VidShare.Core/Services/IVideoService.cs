using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Core.Services
{
    public interface IVideoService
    {
        Task<IEnumerable<Video>> GetAllAsync();
        Video GetById(int id);
        Task<Video> AddAsync(Video video);
        Video Update(Video video);
        void Delete(int id);   
    }
}
