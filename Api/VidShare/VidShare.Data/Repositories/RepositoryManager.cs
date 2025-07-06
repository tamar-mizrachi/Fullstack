using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;
using VidShare.Core.Repositories;

namespace VidShare.Data.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly DataContext _context;
        public readonly IRepository<User> _Users;
        public readonly IRepository<Category> _Categorys;
        public readonly IRepository<Video> _Videos;
        public readonly IRepository<Business_detailes> _BusinessDetailes;

        public RepositoryManager(DataContext context, IRepository<User> userRepository,IRepository<Category> categoryRepository, IRepository<Video>videoRepository, IRepository<Business_detailes> businessDetailesRepository)
        {
            _context = context;
            _Users = userRepository;
            _Categorys=categoryRepository;
            _Videos=videoRepository;
            _BusinessDetailes=businessDetailesRepository;    
        }
        public IRepository<User> Users => _Users;
        public IRepository<Video> videos => _Videos;
        public IRepository<Category> category => _Categorys;
        public IRepository<Business_detailes> BusinessDetailes => _BusinessDetailes;

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

    }


}
