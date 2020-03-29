using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SpaceDuck.UserService.Models;
using System.Threading.Tasks;

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
            if (ModelState.IsValid)
            {
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
                    return BadRequest();
                }
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> LoginUser(LoginModel login)
        {
            if (ModelState.IsValid)
            {
                User user = await userManager.FindByEmailAsync(login.Email);

                if (user != null)
                {
                    await signInManager.SignOutAsync();

                    Microsoft.AspNetCore.Identity.SignInResult result = await signInManager.PasswordSignInAsync(user, login.Password, false, false);

                    if (result.Succeeded)
                    {
                        return Ok($"Hi {user.UserName}! Your Id: {user.Id}");
                    }
                    else
                    {
                        return Unauthorized();
                    }
                }
                else
                {
                    return Unauthorized();
                }
            }
            else
            {
                return BadRequest();
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