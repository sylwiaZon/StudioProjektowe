namespace SpaceDuck.UserService.Models
{
    public class ApplicationUser
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }

        public static ApplicationUser MapFromUser(User user)
        {
            if (user == null)
                return null;

            return new ApplicationUser
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email
            };
        }
    }
}
