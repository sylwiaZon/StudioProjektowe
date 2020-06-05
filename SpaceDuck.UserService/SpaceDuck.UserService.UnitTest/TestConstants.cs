using SpaceDuck.UserService.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SpaceDuck.UserService.UnitTest
{
    public static class TestConstants
    {
        public static User User = new User
        {
            Id = "testId-1234",
            UserName = "TestUser",
            Email = "test@test.pl",
            //Test1234!
            PasswordHash = "AQAAAAEAACcQAAAAELdZQmRliYi6HN/0LaOydQSSkw5LQGBPFCNNL8Wd/HtabA/BXtTQEf2m+XsPhvid5Q=="
        };

        public static RegisterModel RegisterModel = new RegisterModel
        {
            Name = User.UserName,
            Email = User.Email,
            Password = "Test1234!"
        };

        public static LoginModel LoginModel = new LoginModel
        {
            Name = User.Email,
            Password = RegisterModel.Password
        };
    }
}
