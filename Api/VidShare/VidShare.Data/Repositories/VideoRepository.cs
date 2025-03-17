using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;
using VidShare.Core.Repositories;
namespace VidShare.Data.Repositories
{
    public class VideoRepository : IVideoRepository
    {
        private readonly DataContext _context;

        public VideoRepository(DataContext context)
        {
            _context = context;
        }   
        public List<Video> GetAll()
        {
            return _context.videos.ToList();
        }
        public Video? GetById(int id) { 

            return _context.videos.FirstOrDefault(v => v.Id == id);
        }
        public Video Add(Video video)
        {
            _context.videos.Add(video);
            return video;
        }
        public Video Update(Video video) { 
             var existingVideo = GetById(video.Id);
            if (existingVideo is null)
            {
                throw new Exception("Video not found");
            }
            existingVideo.Title = video.Title;
            existingVideo.CreatedDate = video.CreatedDate;
            existingVideo.Description = video.Description;
            existingVideo.UploadDate = DateTime.Now;
            existingVideo.CreatorId= video.CreatorId;
            existingVideo.VideoUrl = video.VideoUrl;  
            return existingVideo;
        }
        public void Delete(int id) {
            var existingVideo= GetById(id);
            if (existingVideo is not null) { 
                 _context.videos.Remove(existingVideo);
            }
        }

        Video IVideoRepository.Delete(int id)
        {
            throw new NotImplementedException();
        }
    }
}
