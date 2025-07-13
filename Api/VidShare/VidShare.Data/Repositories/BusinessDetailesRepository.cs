/*using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using VidShare.Core.Models;
using VidShare.Core.Repositories;

namespace VidShare.Data.Repositories
{
    public class BusinessDetailesRepository : Repository<Business_detailes>, IBusinessDetailesRepository
    {
        private readonly DataContext _context;
        private readonly DbSet<Business_detailes> _dbSet;
        public BusinessDetailesRepository(DataContext context) : base(context)
        {
            _context = context;
            _dbSet = _context.Set<Business_detailes>();
        }


        public new Business_detailes Update(Business_detailes bd)
        {
            var existingBusiness_detailes = GetById(bd.Id);
            if (existingBusiness_detailes is null)
            {
                throw new Exception("User not found");
            }
            existingBusiness_detailes.Name = bd.Name;
            existingBusiness_detailes.Email = bd.Email;
            existingBusiness_detailes.Phone = bd.Phone;
            existingBusiness_detailes.Address = bd.Address;
            return existingBusiness_detailes;
        }
        public void Delete(int id)
        {
            var existingBusinessDetailes = GetById(id);
            if (existingBusinessDetailes is not null)
            {
                _context.businessDetailes.Remove(existingBusinessDetailes);
            }
        }
    }
}
*/