using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;
using VidShare.Core.Repositories;
using VidShare.Core.Services;

namespace VidShare.Service
{
    public class BusinessDetailesService: IBusinessDetailesService
    {
        private readonly IRepositoryManager _repositoryManager;
        public BusinessDetailesService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }
        public async Task<IEnumerable<Business_detailes>> GetAllAsync()
        {
            return await _repositoryManager.BusinessDetailes.GetAllAsync();
        }
        public Business_detailes? GetById(int id)
        {
            return _repositoryManager.BusinessDetailes.GetById(id);
        }
        public async Task<Business_detailes> AddAsync(Business_detailes business_detailes)
        {
            var newBusiness_detailes = await _repositoryManager.BusinessDetailes.AddAsync(business_detailes);
            _repositoryManager.Save();
            return newBusiness_detailes;
        }
        public Business_detailes Update(int  id,Business_detailes business_detailes)
        {
            var dbBusiness_detailes= GetById(id);
            if (dbBusiness_detailes == null) { return null; }
            dbBusiness_detailes.Phone = business_detailes.Phone;
            dbBusiness_detailes.Email= business_detailes.Email;
            dbBusiness_detailes.City= business_detailes.City;
            dbBusiness_detailes.Address= business_detailes.Address;
            dbBusiness_detailes.Name= business_detailes.Name;   

            _repositoryManager.BusinessDetailes.Update(business_detailes);
            _repositoryManager.Save();
            return dbBusiness_detailes;
        }
        public void Delete(Business_detailes business_detailes)
        {
            _repositoryManager.BusinessDetailes.Delete(business_detailes);
            _repositoryManager.Save();
        }
    }
}

