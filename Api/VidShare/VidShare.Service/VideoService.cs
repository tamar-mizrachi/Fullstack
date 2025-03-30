using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;
using VidShare.Core.Repositories;
using VidShare.Core.Services;

namespace VidShare.Service
{
    public class VideoService : IVideoService
    {
        private readonly IRepositoryManager _irepositoryManager;
        public VideoService(IRepositoryManager irepositoryManager)
        {
            _irepositoryManager = irepositoryManager;
        }

        public async Task<IEnumerable<Video>> GetAllAsync()
        {
            return await _irepositoryManager.videos.GetAllAsync(); 
        }
    
        public Video? GetById(int id)
        {
            return _irepositoryManager.videos.GetById(id);
        }
        public async Task<Video> AddAsync(Video video)
        {
            var newVideo=await _irepositoryManager.videos.AddAsync(video);
            _irepositoryManager.Save();
            return newVideo;
        }
        public Video Update(Video video)
        {
           var newVideo= _irepositoryManager.videos.Update(video);
            _irepositoryManager.Save();
            return newVideo;
        }
        public void Delete(int id)
        {
            _irepositoryManager.videos.Delete(GetById(id));
            _irepositoryManager.Save();
        }

    }
}


