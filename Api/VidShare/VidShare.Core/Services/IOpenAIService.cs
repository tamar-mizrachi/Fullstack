using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.DTOs;


namespace VidShare.Core.Services
{
    public interface IOpenAIService
    {
        Task<VideoTranscriptionResult> TranscribeFromUrlAsync(string videoUrl);
        Task<string> SummarizeTextAsync(string text);
    }
}