namespace VidShare.API.Models
{
    public class UserPostModel
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; }
        public int UserId { get; set; }
    }
}
