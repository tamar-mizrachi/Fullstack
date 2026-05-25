using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VidShare.Core.DTOs
{
    public class VideoTranscriptionResult
    {
        public string Transcript { get; set; } = "";
        public bool NoSpeech { get; set; }
    }
}
