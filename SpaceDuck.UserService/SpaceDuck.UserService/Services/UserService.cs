using Microsoft.AspNetCore.Identity;
using SpaceDuck.UserService.Models;
using System.Threading.Tasks;

namespace SpaceDuck.UserService.Services
{
    public interface IUserService
    {
        Task<ApplicationUser> GetUserById(string id);
    }
    public class UserService : IUserService
    {
        private UserManager<User> userManager;

        public UserService(UserManager<User> userMgr)
        {
            userManager = userMgr;
        }

        public async Task<ApplicationUser> GetUserById(string id)
        {
            var user = await userManager.FindByIdAsync(id);

            return ApplicationUser.MapFromUser(user);
        }
    }
}
