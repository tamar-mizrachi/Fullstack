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
    public  class VideoService: IVideoService
    {
        private readonly IVideoRepository _videoRepository;
        public VideoService(IVideoRepository videoRepository)
        {
            _videoRepository = videoRepository;
        }
        public List<Video> GetAll()
        {
            return _videoRepository.GetAll();
        }
        public Video? GetById(int id)
        {
            return _videoRepository.GetById(id);
        }
        public Video Add(Video video) { 
        return _videoRepository.Add(video);
        }
        public Video Update(Video video)
        {
            return _videoRepository.Update(video);
        }
        public Video Delete(int id)
        {
            return _videoRepository.Delete(id);
        }

      
    }
}
