using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Data
{
    public class DataContext : DbContext
    {
        public DbSet<Business_detailes> businessDetailes { get; set; }
        public DbSet<Video> videos { get; set; }
        public DbSet<User> users { get; set; }
        public DbSet<Category> categorys { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Database=VidShareDB");
        }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer(@"Server=db;Database=VidShareDB;User Id=sa;Password=YourPassword123;");
        //}


    }


}
