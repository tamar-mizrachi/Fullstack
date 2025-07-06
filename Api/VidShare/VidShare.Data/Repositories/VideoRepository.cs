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

        public VideoRepository(DataContext context) : base(context)
        {
            _context = context;
            _dbSet = _context.Set<Video>();
        }

        public async Task<Video> Update(Video video)
        {
            var existingVideo = await GetByIdAsync(video.Id);
            if (existingVideo is null)
            {
                throw new Exception("Video not found");
            }
            existingVideo.Title = video.Title;
            existingVideo.CreatedDate = video.CreatedDate;
            existingVideo.Description = video.Description;
            existingVideo.UploadDate = DateTime.Now;
            existingVideo.CategoryId = video.CategoryId;
            existingVideo.VideoUrl = video.VideoUrl;
            return existingVideo;
        }
        //public void Delete(int id) {
        //    var existingVideo=GetByIdAsync(id);
        //    if (existingVideo is not null) { 
        //         _context.videos.Remove(existingVideo);
        //    }
        //}

        public async Task DeleteAsync(int id)
        {
            var existingVideo = await GetByIdAsync(id);
            if (existingVideo != null)
            {
                _context.videos.Remove(existingVideo);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<List<Video>> GetByUserIdAsync(int userId)
        {
            return await _context.videos
                .Where(v => v.UserId == userId)
                .ToListAsync();
        }
    }
    
}
