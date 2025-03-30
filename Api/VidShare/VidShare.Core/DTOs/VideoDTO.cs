﻿using System;
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
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UploadDate { get; set; } = DateTime.Now;
        public int CreatorId { get; set; }
        public string NameTalk { get; set; }
        public string VideoUrl { get; set; }
        public string ?Category { get; set; }
        public string ?transcription { get; set; }
        public Video video { get; set; }
        public Category category { get; set; }
    }
}
