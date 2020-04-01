using Microsoft.AspNetCore.Mvc;

namespace SpaceDuck.UserService.Controllers
{
    [Route("api/index")]
    [ApiController]
    public class IndexController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetIndex()
        {
            return Ok("Welcome in space duck");
        }
    }
}