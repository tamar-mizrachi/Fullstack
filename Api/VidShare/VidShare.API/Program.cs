/*using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;
using VidShare.Core;
using VidShare.Core.Models;
using VidShare.Core.Repositories;
using VidShare.Core.Services;
using VidShare.Data;
using VidShare.Data.Repositories;
using VidShare.Service;
using Microsoft.Extensions.Configuration;
using Amazon.S3;
using Amazon.Extensions.NETCore.Setup;
using Amazon;
using Amazon.Runtime;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});
builder.Services.AddScoped<IUserService,UserService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
//builder.Services.AddScoped<IBusinessDetailesService, BusinessDetailesService>();
builder.Services.AddScoped<IVideoService, VideoService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IRepository<User>, Repository<User>>();
builder.Services.AddScoped<IRepository<Video>, Repository<Video>>();
builder.Services.AddScoped<IRepository<Business_detailes>, Repository<Business_detailes>>();
builder.Services.AddScoped<IRepository<Category>, Repository<Category>>();
builder.Services.AddScoped<AuthService>();

//builder.Services.AddDefaultAWSOptions(configuration.GetAWSOptions());
//builder.Services.AddAWSService<IAmazonS3>();
//var awsSection = configuration.GetSection("AWS");
//var credentials = new BasicAWSCredentials(
//    awsSection["AccessKey"],
 //   awsSection["SecretKey"]
//);
//
//var region = RegionEndpoint.GetBySystemName(awsSection["Region"]);

var awsSection = configuration.GetSection("AWS");

var accessKey = awsSection["AccessKey"] ?? Environment.GetEnvironmentVariable("AWS__AccessKey");
var secretKey = awsSection["SecretKey"] ?? Environment.GetEnvironmentVariable("AWS__SecretKey");
var regionName = awsSection["Region"] ?? Environment.GetEnvironmentVariable("AWS__Region") ?? "eu-north-1";

var credentials = new BasicAWSCredentials(accessKey, secretKey);
var region = RegionEndpoint.GetBySystemName(regionName);


builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    return new AmazonS3Client(credentials, region);
});

//builder.Services.AddDbContext<DataContext>();
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//builder.Services.AddSingleton<DataContext>();//לחבר את זה לדטה ביס
builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});
builder.Services.AddCors(opt => opt.AddPolicy("MyPolicy", policy =>
{
    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
}));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        //options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("EditorOrAdmin", policy => policy.RequireRole("Editor", "Admin"));
    options.AddPolicy("ViewerOnly", policy => policy.RequireRole("Viewer"));
});
builder.Services.Configure<OpenAi>(builder.Configuration.GetSection("OpenAI"));
builder.Services.AddHttpClient(); // חובה אם עוד לא קיים
builder.Services.AddScoped<OpenAIService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("MyPolicy");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();
app.MapGet("/", () => "AuthServer API is running");
app.Run();
*/

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;
using VidShare.Core;
using VidShare.Core.Models;
using VidShare.Core.Repositories;
using VidShare.Core.Services;
using VidShare.Data;
using VidShare.Data.Repositories;
using VidShare.Service;
using Microsoft.EntityFrameworkCore;
using Amazon.S3;
using Amazon.Runtime;
using Amazon;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// ------------------------- Services -------------------------

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

// CORS - רק ל־frontend שלך
builder.Services.AddCors(opt => opt.AddPolicy("MyPolicy", policy =>
{
    policy.WithOrigins("https://vidshareclient.onrender.com")
          .AllowAnyHeader()
          .AllowAnyMethod();
}));

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Description = "Bearer Authentication with JWT Token"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Id = "Bearer", Type = ReferenceType.SecurityScheme }
            },
            new List<string>()
        }
    });
});

// JWT Authentication
var jwtKey = Environment.GetEnvironmentVariable("JWT__KEY") ?? configuration["Jwt:Key"];
var jwtIssuer = Environment.GetEnvironmentVariable("JWT__ISSUER") ?? configuration["Jwt:Issuer"];
var jwtAudience = Environment.GetEnvironmentVariable("JWT__AUDIENCE") ?? configuration["Jwt:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    if (string.IsNullOrEmpty(jwtKey))
        throw new Exception("JWT Key not set in environment variables.");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// Authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("EditorOrAdmin", policy => policy.RequireRole("Editor", "Admin"));
    options.AddPolicy("ViewerOnly", policy => policy.RequireRole("Viewer"));
});

// OpenAI
builder.Services.Configure<OpenAi>(options =>
{
    options.ApiKey = Environment.GetEnvironmentVariable("OpenAI__ApiKey");
});
builder.Services.AddHttpClient();
builder.Services.AddScoped<OpenAIService>();

// AWS S3
var awsAccessKey = Environment.GetEnvironmentVariable("AWS__AccessKey");
var awsSecretKey = Environment.GetEnvironmentVariable("AWS__SecretKey");
var awsRegion = Environment.GetEnvironmentVariable("AWS__Region") ?? "eu-north-1";

var awsCredentials = new BasicAWSCredentials(awsAccessKey, awsSecretKey);
var regionEndpoint = RegionEndpoint.GetBySystemName(awsRegion);
builder.Services.AddSingleton<IAmazonS3>(sp => new AmazonS3Client(awsCredentials, regionEndpoint));

// Database
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

// Dependency Injection
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IVideoService, VideoService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<AuthService>();
builder.Services.AddAutoMapper(typeof(MappingProfile));

// ------------------------- Build App -------------------------
var app = builder.Build();

// Middleware
app.UseCors("MyPolicy");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Map Controllers
app.MapControllers();
app.MapGet("/", () => "AuthServer API is running");

app.Run();
