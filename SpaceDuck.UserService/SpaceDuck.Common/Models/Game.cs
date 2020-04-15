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

    public class KalamburyGame : Game
    {
        public string CurrentPlayerId { get; set; }
        public List<string> SubmittedForDrawing { get; set; }
    }

    public class GameStatus
    {
        public string Word { get; set; }
        public int[] Canvas { get; set; }
        public string CurrentPlayerId { get; set; }
        public bool IsFinished { get; set; }
    }
}
