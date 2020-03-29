namespace SpaceDuck.UserService.Models
{
    public class RegisterModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string CommunityId { get; set; }
    }

    public class EditUserModel : RegisterModel
    {
        public string NewPassword { get; set; }
    }
}
