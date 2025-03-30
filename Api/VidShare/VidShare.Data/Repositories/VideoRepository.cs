using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;
using VidShare.Core.Repositories;
namespace VidShare.Data.Repositories
{
    public class VideoRepository : Repository<Video>, IVideoRepository
    {
        private readonly DataContext _context;
        private readonly DbSet<Video> _dbSet;

        public VideoRepository(DataContext context):base(context) 
        {
            _context = context;
            _dbSet = _context.Set<Video>(); 
        }   
      
        public new Video Update(Video video) { 
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
    }
}
