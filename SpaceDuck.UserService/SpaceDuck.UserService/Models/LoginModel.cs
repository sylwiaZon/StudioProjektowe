using System.ComponentModel.DataAnnotations;

namespace SpaceDuck.UserService.Models
{
    public class LoginModel
    {
        [Required]
        public string Name { get; set; } // Login or Email
        [Required]
        public string Password { get; set; }
    }
}
