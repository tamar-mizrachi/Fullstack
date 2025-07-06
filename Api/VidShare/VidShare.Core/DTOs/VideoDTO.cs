using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Core.DTOs
{
    public class VideoDTO
    {
        public int Id { get; set; }
        public string ?Title { get; set; }
        public string ?Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UploadDate { get; set; } = DateTime.Now;
        public string ?NameTalk { get; set; }
        public required string VideoUrl { get; set; }
        public int CategoryId { get; set; }
        public int UserId { get;set; }
    }
}
