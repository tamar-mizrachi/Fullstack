using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Core.Repositories
{
    public interface IRepositoryManager
    {
        IRepository<User> Users { get; }
      //  IRepository<Business_detailes> BusinessDetailes { get; }
        IRepository<Category> category { get; }
        IRepository<Video> videos { get; }
        Task SaveAsync();

    }
}
