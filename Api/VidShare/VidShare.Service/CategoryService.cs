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
        public Category? GetById(int id)
        {
            return _irepositoryManager.category.GetById(id);
        }
        public async Task<Category> AddAsync(Category category)
        {
            var newcategory= await _irepositoryManager.category.AddAsync(category);
            _irepositoryManager.Save();
            return newcategory;
        }
        public  Category Update(Category category)
        {
            var dbCategory = GetById(category.Id);
            if(dbCategory == null) { return null; }
            dbCategory.Name= category.Name;
            _irepositoryManager.category.Update(dbCategory);
            _irepositoryManager.Save();
            return dbCategory;
        }
        public void Delete(int id)
        {
            _irepositoryManager.category.Delete(GetById(id));
            _irepositoryManager.Save();   
        }
    }

}

