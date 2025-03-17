﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.Models;

namespace VidShare.Core.Services
{
    public interface IUserService
    {
        List<User> GetAll();
        User? GetById(int id);
        User Add(User user);
        User Update(User user);
        void Delete(int id);
    }
}
