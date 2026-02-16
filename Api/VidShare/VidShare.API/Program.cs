
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
using Amazon.S3;
using Amazon;
using Amazon.Runtime;
using Microsoft.EntityFrameworkCore;

// ❌ הוסר: using Xabe.FFmpeg.Downloader;

var builder = WebApplication.CreateBuilder(args);

// ❌ הוסר: הורדת FFmpeg בהפעלה
// Console.WriteLine("📥 Downloading FFmpeg...");
// await FFmpegDownloader.GetLatestVersion(FFmpegVersion.Official);
// Console.WriteLine("✅ FFmpeg ready!");

// ✅ Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ✅ Swagger
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

// ✅ Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IVideoService, VideoService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IRepository<User>, Repository<User>>();
builder.Services.AddScoped<IRepository<Video>, Repository<Video>>();
builder.Services.AddScoped<IRepository<Business_detailes>, Repository<Business_detailes>>();
builder.Services.AddScoped<IRepository<Category>, Repository<Category>>();
builder.Services.AddScoped<AuthService>();

// ✅ AWS S3
var awsSection = builder.Configuration.GetSection("AWS");
var accessKey = awsSection["AccessKey"];
var secretKey = awsSection["SecretKey"];
var regionName = awsSection["Region"] ?? "eu-north-1";

if (!string.IsNullOrEmpty(accessKey) && !string.IsNullOrEmpty(secretKey))
{
    var credentials = new BasicAWSCredentials(accessKey, secretKey);
    var region = RegionEndpoint.GetBySystemName(regionName);

    builder.Services.AddSingleton<IAmazonS3>(sp =>
        new AmazonS3Client(credentials, region)
    );

    Console.WriteLine($"✅ AWS S3 configured: {regionName}");
}
else
{
    Console.WriteLine("⚠️ AWS credentials not found");
}

// ✅ Database
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// ✅ JSON Options
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

// ✅ CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicy", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:5174",
            "http://localhost:5116",
            "https://divshare-client.onrender.com"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// ✅ JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]??"")
        )
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("EditorOrAdmin", policy => policy.RequireRole("Editor", "Admin"));
    options.AddPolicy("ViewerOnly", policy => policy.RequireRole("Viewer"));
});

// ✅ HTTP Client עם timeout מוגדל
builder.Services.AddHttpClient("TranscriptionClient", client =>
{
    client.Timeout = TimeSpan.FromMinutes(10);
});

// ✅ OpenAI
builder.Services.Configure<OpenAi>(builder.Configuration.GetSection("OpenAI"));
builder.Services.AddHttpClient();
builder.Services.AddScoped<OpenAIService>();

var app = builder.Build();

// ✅ Pipeline
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
app.MapGet("/", () => "VidShare API is running ✅");

Console.WriteLine("🚀 Server started on http://localhost:5116");

app.Run();