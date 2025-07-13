using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.DTOs;
using VidShare.Core.Models;
using VidShare.Core.Repositories;

namespace VidShare.Data.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly DataContext _context;
        private readonly DbSet<T> _dbSet;

        public Repository(DataContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }
        public async Task<T> AddAsync(T entity)
        {
          await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        //public void Delete(T entity)
        //{
        //    _dbSet.Remove(entity);
        //}
        public async Task DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }
     

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            await _context.users.Include(v => v.Videos).ToListAsync();
            await _context.categorys.Include(v => v.Videos).ToListAsync();
            _context.businessDetailes.ToList();
            _context.videos.ToList();
            return await _dbSet.ToListAsync();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }
        //public async Task<List<T?>> GetByUserIdAsync(int userId)
        //{
        //    // בדיקה אם T יש לו פרופרטי UserId
        //    var userIdProperty = typeof(T).GetProperty("UserId");
        //    if (userIdProperty == null)
        //    {
        //        throw new InvalidOperationException($"Type {typeof(T).Name} does not have a UserId property");
        //    }

        //    return await _dbSet.FirstOrDefaultAsync(entity => EF.Property<int>(entity, "UserId") == userId);
        //}

        public async Task<List<T?>> GetByUserIdAsync(int userId)
        {
            // בדיקה אם T יש לו פרופרטי UserId
            var userIdProperty = typeof(T).GetProperty("UserId");
            if (userIdProperty == null)
            {
                throw new InvalidOperationException($"Type {typeof(T).Name} does not have a UserId property");
            }

            // שנה מ-FirstOrDefaultAsync ל-Where + ToListAsync
            return await _dbSet.Where(entity => EF.Property<int>(entity, "UserId") == userId).ToListAsync();
        }
        public async Task<T> UpdateAsync(T entity)
        {
            _dbSet.Update(entity); // סינכרוני
            await _context.SaveChangesAsync(); // שמירה אסינכרונית
            return entity;
        }


        public async Task<T?> GetByLoginAsync(string name, string password)
        {
            return _dbSet.FirstOrDefault(e => EF.Property<string>(e, "Name") == name && EF.Property<string>(e, "Password") == password);
        }

    }
}
