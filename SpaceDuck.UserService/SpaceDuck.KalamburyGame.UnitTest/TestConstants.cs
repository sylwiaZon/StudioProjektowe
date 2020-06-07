using SpaceDuck.Common.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SpaceDuck.KalamburyGame.UnitTest
{
    public class TestConstants
    {
        public static Room Room1 = new Room
        {
            GameType = GameType.KalamburyGame,
            Id = 1
        };

        public static Room Room2 = new Room
        {
            GameType = GameType.KalamburyGame,
            Id = 2
        };
    }
}
