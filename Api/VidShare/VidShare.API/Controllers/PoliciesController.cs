using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace VidShare.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        [HttpGet("admin-only")]
        [Authorize(Policy = "AdminOnly")] // רק Admin יכול לגשת
        public IActionResult AdminOnly()
        {
            return Ok("This is accessible only by Admins.");
        }

        [HttpGet("viewer-only")]
        [Authorize(Policy = "ViewerOnly")] // רק Viewer יכול לגשת
        public IActionResult ViewerOnly()
        {
            return Ok("This is accessible only by Viewers.");
        }

        [HttpGet("authenticated-only")]
        [Authorize] // כל משתמש מאומת יכול לגשת
        public IActionResult AuthenticatedOnly()
        {
            return Ok("This is accessible by any authenticated user.");
        }
    }
}
