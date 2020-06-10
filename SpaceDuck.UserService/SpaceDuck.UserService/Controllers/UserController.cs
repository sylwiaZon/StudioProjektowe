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
        private IUserValidator<User> userValidator;
        private IPasswordValidator<User> passwordValidator;
        private IPasswordHasher<User> passwordHasher;

        public UserController(UserManager<User> userMgr,
            SignInManager<User> signInMgr,
            IUserValidator<User> userValid,
            IPasswordValidator<User> passwordValid,
            IPasswordHasher<User> passwordHash)
        {
            userManager = userMgr;
            signInManager = signInMgr;
            userValidator = userValid;
            passwordValidator = passwordValid;
            passwordHasher = passwordHash;
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
                return Ok(ApplicationUser.MapFromUser(user));
            }
            else
            {
                return Unauthorized();
            }
        }

        //[Authorize]
        [Route("info/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetUserInfo(string id)
        {
            return Ok(ApplicationUser.MapFromUser(await userManager.FindByIdAsync(id)));
        }

        [Authorize]
        [Route("user/{id}")]
        [HttpPost]
        public async Task<IActionResult> EditUser(string id, EditUserModel editUserModel)
        {
            User user = await userManager.FindByIdAsync(id);

            if (user == null) return NoContent();

            user.UserName = editUserModel.Name;
            user.Email = editUserModel.Email;

            IdentityResult identityResult = await userValidator.ValidateAsync(userManager, user);

            if (!identityResult.Succeeded
                || string.IsNullOrEmpty(editUserModel.NewPassword)) return BadRequest();

            var checkPasswordHash = await userManager.CheckPasswordAsync(user, editUserModel.Password);

            if (!checkPasswordHash) return BadRequest();

            var validPass = await passwordValidator.ValidateAsync(userManager, user, editUserModel.NewPassword);

            if (!validPass.Succeeded) return BadRequest();

            user.PasswordHash = passwordHasher.HashPassword(user, editUserModel.NewPassword);

            await userManager.UpdateAsync(user);

            return Ok();
        }

        [Authorize]
        [Route("user/{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteUser(string id)
        {
            User user = await userManager.FindByIdAsync(id);

            IdentityResult result = await userManager.DeleteAsync(user);

            if (!result.Succeeded) return BadRequest();

            return NoContent();
        }
    }
}