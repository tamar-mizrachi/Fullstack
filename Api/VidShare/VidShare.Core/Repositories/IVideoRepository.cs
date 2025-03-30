using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Core.Repositories
{
    public interface IVideoRepository
    {
        Video Update(Video video);
        void Delete(int id);

    }
}
