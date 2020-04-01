using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SpaceDuck.UserService.Models;
using System.Threading.Tasks;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace SpaceDuck.UserService.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private UserManager<User> userManager;
        private SignInManager<User> signInManager;

        public UserController(UserManager<User> userMgr,
            SignInManager<User> signInMgr)
        {
            userManager = userMgr;
            signInManager = signInMgr;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> RegisterUser(RegisterModel registerModel)
     {
            if (!ModelState.IsValid) return BadRequest();

            User user = new User
            {
                Email = registerModel.Email,
                UserName = registerModel.Name
            };

            IdentityResult result = await userManager.CreateAsync(user, registerModel.Password);

            if (result.Succeeded)
            {
                return Ok($"Please sing in {user.UserName}");
            }
            else
            {
                return Ok("This user can not be created!");
            }
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> LoginUser(LoginModel login)
        {
            if (!ModelState.IsValid) return BadRequest();

            User user = await userManager.FindByEmailAsync(login.Name);

            if (user == null)
                user = await userManager.FindByNameAsync(login.Name);

            if (user == null) return Unauthorized();
            
            await signInManager.SignOutAsync();

            SignInResult result = await signInManager.PasswordSignInAsync(user, login.Password, false, false);

            if (result.Succeeded)
            {
                return Ok($"Hi {user.UserName}! Your Id: {user.Id}");
            }
            else
            {
                return Unauthorized();
            }
        }

        [Authorize]
        [Route("info/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetUserInfo(string id)
        {
            return Ok(ApplicationUser.MapFromUser(await userManager.FindByIdAsync(id)));
        }
    }
}