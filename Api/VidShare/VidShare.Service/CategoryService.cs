using AutoMapper;
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
    public class CategoryService: ICategoryService
    {
        private readonly IRepositoryManager _irepositoryManager;
        public CategoryService(IRepositoryManager irepositoryManager)
        {
           _irepositoryManager = irepositoryManager;
        }
        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _irepositoryManager.category.GetAllAsync();
           
        }
        public async Task< Category?> GetByIdAsync(int id)
        {
            return await _irepositoryManager.category.GetByIdAsync(id);
        }
        public async Task<Category> AddAsync(Category category)
        {
            var newcategory= await _irepositoryManager.category.AddAsync(category);
            await _irepositoryManager.SaveAsync();
            return newcategory;
        }
        public  async Task<Category> UpdateAsync(Category category)
        {
            var dbCategory = await GetByIdAsync(category.Id);
            if(dbCategory == null) { return null; }
            dbCategory.Name= category.Name;
           await _irepositoryManager.category.UpdateAsync(dbCategory);
            await _irepositoryManager.SaveAsync();
            return dbCategory;
        }
        //public void Delete(int id)
        //{
        //    _irepositoryManager.category.Delete(GetByIdAsync(id));
        //    _irepositoryManager.Save();   
        //}

        public async Task DeleteAsync(int id)
        {
            var category = await _irepositoryManager.category.GetByIdAsync(id);
            _irepositoryManager.category.DeleteAsync(category);
            await _irepositoryManager.SaveAsync();
        }

    }

}

