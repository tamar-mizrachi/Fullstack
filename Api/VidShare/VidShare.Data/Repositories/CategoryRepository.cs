using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;
using VidShare.Core.Repositories;

namespace VidShare.Data.Repositories
{
    public class CategoryRepository: Repository<Category>, ICategoryRepository
    {
        private readonly DataContext _context;
        private readonly DbSet<Category>  _dbSet;

        public CategoryRepository(DataContext context) : base(context)
        {
            _context = context;
            _dbSet= _context.Set<Category>();
        }
      
     
      
        public new Category Update(Category category)
        {
            var existingUser = GetById(category.Id);
            if (existingUser is null)
            {
                throw new Exception("User not found");
            }
            existingUser.Name = category.Name;
            return existingUser;
        }
        public void Delete(int id)
        {
            var existingCategory = GetById(id);
            if (existingCategory is not null)
            {
                _context.categorys.Remove(existingCategory);
            }
        }
    }
}
