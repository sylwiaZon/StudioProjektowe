using System;
using System.Collections.Generic;
using System.Text;

namespace SpaceDuck.Common.Models
{
    public class Game
    {
        public string Id { get; set; }
        public Room Room { get; set; }
    }

    public class ChessGame : Game
    {
        public string CurrentPlayerId { get; set; }
    }

    public class GameStatus
    {
        public string Word { get; set; }
        public string CurrentPlayerId { get; set; }
        public bool Finished { get; set; }
        public bool Draw { get; set; }
        public bool Resigned { get; set; }

    }
}
