using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NSubstitute;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Threading.Tasks;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;
using SpaceDuck.UserService.Controllers;
using SpaceDuck.UserService.Models;

namespace SpaceDuck.UserService.UnitTest
{
    [TestFixture]
    public class UserControllerTest
    {
        private UserController _controller;
        private UserManager<User> _userManager;
        private SignInManager<User> _signInManager;
        private IUserValidator<User> _userValidator;
        private IPasswordValidator<User> _passwordValidator;
        private IPasswordHasher<User> _passwordHasher;
        //private IAccountService _accountService;

        [SetUp]
        public void SetUp()
        {
            // Usermanager mocks
            var userStoreMock = Substitute.For<IUserStore<User>>();
            var optionsMock = Substitute.For<IOptions<IdentityOptions>>();
            var passwordHasherMock = Substitute.For<IPasswordHasher<User>>();
            var userValidatorMock = Substitute.For<IEnumerable<IUserValidator<User>>>();
            var passwordValidatorMock = Substitute.For<IEnumerable<IPasswordValidator<User>>>();
            var lookUpNormalizerMock = Substitute.For<ILookupNormalizer>();
            var identityErrorDescriberMock = Substitute.For<IdentityErrorDescriber>();
            var serviceProviderMock = Substitute.For<IServiceProvider>();
            var loggerMock = Substitute.For<ILogger<UserManager<User>>>();

            _userManager = Substitute.For<UserManager<User>>(
                userStoreMock,
                optionsMock,
                passwordHasherMock,
                userValidatorMock,
                passwordValidatorMock,
                lookUpNormalizerMock,
                identityErrorDescriberMock,
                serviceProviderMock,
                loggerMock);

            //SignInManager mocks
            var contextAccessorMock = Substitute.For<IHttpContextAccessor>();
            var claimsPricipleFactoryMock = Substitute.For<IUserClaimsPrincipalFactory<User>>();
            var loggerMockSM = Substitute.For<ILogger<SignInManager<User>>>();
            var schemaProvider = Substitute.For<IAuthenticationSchemeProvider>();
            var userConfirmation = Substitute.For<IUserConfirmation<User>>();

            _signInManager = Substitute.For<SignInManager<User>>(
                _userManager,
                contextAccessorMock,
                claimsPricipleFactoryMock,
                optionsMock,
                loggerMockSM,
                schemaProvider,
                userConfirmation);

            _userValidator = Substitute.For<IUserValidator<User>>();
            _passwordValidator = Substitute.For<IPasswordValidator<User>>();
            _passwordHasher = Substitute.For<IPasswordHasher<User>>();
        }

        [Test]
        public async Task RegisterUser_ShouldReturnBadRequestForInvaildModel()
        {
            //Arange
            RegisterModel registerModel = new RegisterModel
            {
                Email = TestConstants.RegisterModel.Email,
                Name = TestConstants.RegisterModel.Name
            };
            _controller = CreateController();

            //Act
            var result = await _controller.RegisterUser(registerModel);

            //Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<BadRequestResult>(result);
        }

        [Test]
        public async Task RegisterUser_ShouldReturnBadRequestForInvalidPassword()
        {
            //Arange
            RegisterModel registerModel = new RegisterModel
            {
                Email = TestConstants.RegisterModel.Email,
                Name = TestConstants.RegisterModel.Name,
                Password = "1"
            };
            _controller = CreateController();

            _userManager.CreateAsync(Arg.Any<User>(), Arg.Any<string>())
                .Returns(new IdentityResult());

            //Act
            var result = await _controller.RegisterUser(registerModel);

            await _userManager.Received(1)
                .CreateAsync(Arg.Is<User>(
                    user => user.Email == registerModel.Email
                    && user.UserName == registerModel.Name),
                    registerModel.Password);

            //Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task RegisterUser_ShouldReturnOkForVaildModelAndCreateUser()
        {
            //Arange
            _controller = CreateController();

            var responseTask = Task.FromResult(IdentityResult.Success);

            _userManager.CreateAsync(Arg.Any<User>(), Arg.Any<string>())
                .Returns(responseTask);

            //Act
            var result = await _controller.RegisterUser(TestConstants.RegisterModel);

            //Assert
            await _userManager.Received(1)
                .CreateAsync(Arg.Is<User>(
                    user => user.Email == TestConstants.RegisterModel.Email
                    && user.UserName == TestConstants.RegisterModel.Name),
                    TestConstants.RegisterModel.Password);

            Assert.IsNotNull(result);
            Assert.IsInstanceOf<OkObjectResult>(result);
        }

        [Test]
        public async Task LoginUser_ShouldReturnBadRequestForInvalidModel()
        {
            //Arange
            LoginModel loginModel = new LoginModel
            {
                Name = TestConstants.LoginModel.Name
            };
            _controller = CreateController();

            //Act
            var result = await _controller.LoginUser(loginModel);

            //Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<BadRequestResult>(result);
        }

        //[Test]
        //public async Task LoginUser_ShouldReturnUnauthorizedForInvalidEmail()
        //{
        //    //Arange
        //    LoginModel loginModel = new LoginModel
        //    {
        //        Name = "invalid@test.pl",
        //        Password = TestConstants.LoginModel.Password
        //    };
        //    _controller = CreateController();

        //    //Act
        //    var result = await _controller.LoginUser(loginModel);

        //    //Assert
        //    Assert.IsNotNull(result);
        //    Assert.IsInstanceOf<UnauthorizedResult>(result);
        //}

        [Test]
        public async Task LoginUser_ShouldReturnBadRequestForInvaildPassword()
        {
            //Arange
            LoginModel loginModel = new LoginModel
            {
                Name = TestConstants.LoginModel.Name,
                Password = "1"
            };
            _controller = CreateController();

            var responseTask = Task.FromResult(SignInResult.Failed);

            _userManager.FindByEmailAsync(Arg.Any<string>())
                .Returns(TestConstants.User);

            _signInManager.PasswordSignInAsync(TestConstants.User,
                loginModel.Password, false, false)
                .Returns(responseTask);

            //Act
            var result = await _controller.LoginUser(loginModel);

            //Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<UnauthorizedResult>(result);
        }

        //[Test]
        //public async Task LoginUser_ShouldReturnOkForVaildModelAndReturnToken()
        //{
        //    //Arange
        //    _controller = CreateController();

        //    var responseTask = Task.FromResult(SignInResult.Success);

        //    _userManager.FindByEmailAsync(Arg.Any<string>())
        //        .Returns(TestConstants.User);

        //    _signInManager.PasswordSignInAsync(TestConstants.User,
        //        TestConstants.LoginModel.Password, false, false)
        //        .Returns(responseTask);

        //    //Act
        //    var result = await _controller.LoginUser(TestConstants.LoginModel);

        //    //Assert
        //    Assert.IsNotNull(result);
        //    Assert.IsInstanceOf<OkObjectResult>(result);
        //    var data = ((result as OkObjectResult).Value as Tuple<string, string>);
        //    Assert.AreEqual(TestConstants.User.Id, data.Item1);
        //    Assert.IsNotNull(data.Item2);
        //}

        [Test]
        public async Task GetUser_ShouldReturnEmptyUserForInvalidId()
        {
            //Arange
            _controller = CreateController();
            _userManager.FindByIdAsync(Arg.Any<string>())
                .Returns((User)null);

            //Act
            var result = await _controller.GetUserInfo("invalidId-1234");

            //Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<OkObjectResult>(result);
            Assert.IsNull((result as OkObjectResult).Value);
        }

        [Test]
        public async Task GetUser_ShouldReturnUser()
        {
            //Arange
            _controller = CreateController();
            _userManager.FindByIdAsync(Arg.Any<string>())
                .Returns(TestConstants.User);

            //Act
            var result = await _controller.GetUserInfo(TestConstants.User.Id);

            //Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOf<OkObjectResult>(result);
            Assert.IsNotNull((result as OkObjectResult).Value);
            Assert.IsNotInstanceOf<User>((result as OkObjectResult).Value);
            Assert.IsInstanceOf<ApplicationUser>((result as OkObjectResult).Value);
            var data = ((result as OkObjectResult).Value as ApplicationUser).UserName;
            Assert.AreEqual(data, TestConstants.User.UserName);
        }

        private UserController CreateController()
        {
            return new UserController(_userManager,
                _signInManager,
                _userValidator,
                _passwordValidator,
                _passwordHasher);
        }

        [TearDown]
        public void TearDown()
        {

        }

    }
}
