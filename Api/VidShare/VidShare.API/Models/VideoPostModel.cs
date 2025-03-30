namespace VidShare.API.Models
{
    public class VideoPostModel
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UploadDate { get; set; } = DateTime.Now;
        public int CreatorId { get; set; }
        public string NameTalk { get; set; }
        public string VideoUrl { get; set; }
        public string ?Category { get; set; }
        public string transcription { get; set; }
    }
}
