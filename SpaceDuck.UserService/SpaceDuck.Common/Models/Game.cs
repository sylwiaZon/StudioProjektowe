using System;
using System.Collections.Generic;
using System.Text;

namespace SpaceDuck.Common.Models
{
    public class Game
    {
        public string Id { get; set; }
        public Room Room { get; set; }
        public Dictionary<string, int> PlayersPointsPerGame { get; set; }
    }

    public class KalamburyGame : Game
    {
        public string CurrentPlayerId { get; set; }
        public Queue<string> SubmittedForDrawingQue { get; set; } = new Queue<string>();
    }

    public class GameStatus
    {
        public string Word { get; set; } = "";
        public string Canvas { get; set; }
        public string CurrentPlayerId { get; set; }
        public bool IsFinished { get; set; }
        public string Hint { get; set; } = "";

    }

    public class ChessGameStatus
    {
        public string Board { get; set; } = "";
        public string CurrentPlayerId { get; set; }
        public string Result { get; set; } = ""; // "draw" for draw. Winner id otherwise
        public bool IsFinished { get; set; }
        public string ResignedPlayerId { get; set; } = "";
        public bool DrawOffered { get; set; } 
        public bool DrawAccepted { get; set; } 
        public int WhiteClock { get; set; } = 0;
        public int BlackClock { get; set; } = 0;
    }

    public class WordStatus
    {
        public string Word { get; set; }
        public string PlayerId { get; set; }
        public string PlayerName { get; set; }
    }
}
