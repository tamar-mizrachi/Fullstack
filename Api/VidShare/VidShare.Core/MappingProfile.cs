using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VidShare.Core.DTOs;
using VidShare.Core.Models;
using VidShare.API.Models;


namespace VidShare.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<Business_detailes, Business_DetailesDTO>().ReverseMap();
            CreateMap<Video, VideoDTO>().ReverseMap();
            CreateMap<Category, CategoryDTO>().ReverseMap();
            CreateMap<CategoryPostModel, Category>();

            CreateMap<VideoPostModel, Video>();
            // .ForMember(dest => dest.User, opt => opt.MapFrom(src => new User { Id = src.UserId })); // ✅ זה השינוי החשוב
            CreateMap<Video, VideoDTO>();
            CreateMap<VideoPostModel, Video>();

        }
    }

}
