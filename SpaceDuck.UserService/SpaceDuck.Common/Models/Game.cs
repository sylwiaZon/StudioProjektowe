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
        public List<string> SubmittedForDrawing { get; set; } = new List<string>();
    }

    public class ChessGame : Game
    {
        public string CurrentPlayerId { get; set; }
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
        public string WinnerId { get; set; } = "";
        public bool IsFinished { get; set; }
        public bool Resigned { get; set; }
        public bool DrawOffered { get; set; } 
        public bool DrawAccepted { get; set; } 
        public int Round { get; set; } = 0;
        public int RoundTime { get; set; } = 0;
    }

    public class WordStatus
    {
        public string Word { get; set; }
        public string PlayerId { get; set; }
    }
}