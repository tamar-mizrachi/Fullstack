using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Core.Repositories
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();

        T? GetById(int id);

       Task< T> AddAsync(T entity);

        T Update(T entity);

        void Delete(T entity);

        T? GetByLogin(string name, string password);
    }
}
