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
    
        public async Task<Video?> GetByIdAsync(int id)
        {
            return  await _irepositoryManager.videos.GetByIdAsync(id);
        }
        public async Task<List<Video>> GetByUserIdAsync(int userId)
        {
            return await _irepositoryManager.videos.GetByUserIdAsync(userId);
        }
     
     
        public async Task<Video> AddAsync(Video video)
        {
            var newVideo=await _irepositoryManager.videos.AddAsync(video);
            await _irepositoryManager.SaveAsync();
            return newVideo;
        }
        public async Task<Video> UpdateAsync(Video video)
        {
           var newVideo= await _irepositoryManager.videos.UpdateAsync(video);
            await _irepositoryManager.SaveAsync();
            return  newVideo;
        }
        //public void Delete(int id)
        //{
        //    _irepositoryManager.videos.Delete(GetByIdAsync(id));
        //    _irepositoryManager.Save();
        //}

        public async Task DeleteAsync(int UserId)
        {
            var video = await _irepositoryManager.videos.GetByIdAsync(UserId);
           await _irepositoryManager.videos.DeleteAsync(video);
             await _irepositoryManager.SaveAsync();
        }


    }
}


