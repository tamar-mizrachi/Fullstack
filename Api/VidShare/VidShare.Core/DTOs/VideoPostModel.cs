using VidShare.Core.Models;
namespace VidShare.API.Models
{
    public class VideoPostModel
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UploadDate { get; set; } = DateTime.Now;
        public string? NameTalk { get; set; }
        public string VideoUrl { get; set; }
        public int CategoryId { get; set; }
        public int UserId { get; set; }
    }
}
