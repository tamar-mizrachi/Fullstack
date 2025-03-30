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
            _dbSet.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            await _context.users.Include(v => v.Videos).ToListAsync();
            await _context.categorys.Include(v => v.Videos).ToListAsync();
            _context.businessDetailes.ToList();
            _context.videos.ToList();
            return await _dbSet.ToListAsync();
        }

        public T? GetById(int id)
        {
            return _dbSet.Find(id);
        }

        public T Update(T entity)
        {
            _dbSet.Update(entity);
            return entity;
        }

        public T? GetByLogin(string name, string password)
        {
            return _dbSet.FirstOrDefault(e => EF.Property<string>(e, "Name") == name && EF.Property<string>(e, "Password") == password);
        }

    }
}
