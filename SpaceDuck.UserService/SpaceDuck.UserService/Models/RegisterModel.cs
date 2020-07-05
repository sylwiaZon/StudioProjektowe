using System.ComponentModel.DataAnnotations;

namespace SpaceDuck.UserService.Models
{
    public class RegisterModel
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }

    public class EditUserModel : RegisterModel
    {
        public string NewPassword { get; set; }
    }
}
