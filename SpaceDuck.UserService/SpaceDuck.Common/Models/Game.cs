using System.Collections.Generic;

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

    public class ShipsGame : Game
    {
        public List<string> Players { get; set; }
    }

    public class GameStatus
    {
        public string Word { get; set; } = "";
        public string Canvas { get; set; }
        public string CurrentPlayerId { get; set; }
        public bool IsFinished { get; set; }
        public string Hint { get; set; } = "";
        public int Round { get; set; } = 0;
        public int RoundTime { get; set; } = 0;
    }

    public class WordStatus
    {
        public string Word { get; set; }
        public string PlayerId { get; set; }
        public string PlayerName { get; set; }
    }

    public class ShipsField
    {
        public bool IsShip { get; set; } = false;
        public bool IsShot { get; set; } = false;
        public bool IsSunk { get; set; }
        public ShipType shipType { get; set; }
        public int IntCoordinates { get; set; }
        public char CharCoordinates { get; set; }
    }

    public class ShipsBoard
    {
        public string PlayerId { get; set; }
        public string PlayerName { get; set; }
        public ShipsField[][] Board { get; set; }
    }
    
    public class ShipsGameStatus
    {
        public ShipsBoard[] Boards { get; set; }
        public string CurrentPlayerId { get; set; }
        public string CurrentPlayerName { get; set; }
        public int RoundTime { get; set; } = 0;
        public bool IsFinished { get; set; }
        public ShipsField CurrentMove { get; set; }
    }
}
