using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Core.Services
{
    public interface IVideoService
    {
        List<Video> GetAll();
        Video GetById(int id);
        Video Add(Video video);
        Video Update(Video video);
        Video Delete(int id);   
    }
}
