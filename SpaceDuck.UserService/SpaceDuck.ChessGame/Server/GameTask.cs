using SpaceDuck.Common.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ChessGame.Server
{
    public class GameTask
    {
        public bool IsStarted { get; set; } = false;
        public bool Moved { get; set; } = false;
        public ChessGameStatus GameStatus { get; set; }
        public Game Game { get; set; }

        public bool Resigned => GameStatus.ResignedPlayerId != "";


        public GameTask(ChessGameStatus gameStatus, Game game)
        {
            GameStatus = gameStatus;
            Game = game;
        }

        private bool IsEnded()
        {
            if (GameStatus.IsFinished)
            {
                return true;
            }
            if (GameStatus.WhiteClock <= 0 || GameStatus.BlackClock <= 0)
            {
                return true;
            }
            if (GameStatus.Result != "")
            {
                return true;
            }
            if (GameStatus.DrawAccepted)
            {
                return true;
            }
            if (Resigned)
            {
                return true;
            }

            return false;
        }

        public void UpdateGameStatus()
        {
            GameStatus.IsFinished = IsEnded();
        }

        public void ChangeTurn()
        {
            var newPlayer = Game.Room.Players.FirstOrDefault(p => p.Id != GameStatus.CurrentPlayerId);

            GameStatus.CurrentPlayerId = newPlayer?.Id ?? GameStatus.CurrentPlayerId;
            Moved = false;
        }

        public void UpdateClocks()
        {
            var currentPlayer = Game.Room.Players.FirstOrDefault(player => player.Id == GameStatus.CurrentPlayerId);

            if (currentPlayer?.Color == "white")
            {
                GameStatus.WhiteClock--;
            }
            else
            {
                GameStatus.BlackClock--;
            }
        }

        public void UpdatePoints()
        {
            foreach (var (playerId, _) in Game.PlayersPointsPerGame.ToArray())
            {
                if (GameStatus.DrawAccepted)
                {
                    Game.PlayersPointsPerGame[playerId] += 0;
                    continue;
                }
                if (Resigned)
                {
                    if (playerId == GameStatus.ResignedPlayerId)
                        Game.PlayersPointsPerGame[playerId] -= 70;
                    else
                        Game.PlayersPointsPerGame[playerId] += 100;
                    continue;
                }
                if (GameStatus.Result != "")
                {
                    if (GameStatus.Result == "draw")
                    {
                        Game.PlayersPointsPerGame[playerId] += 0;
                    }
                    else
                    {
                        if (playerId == GameStatus.Result)
                            Game.PlayersPointsPerGame[playerId] += 100;
                        else
                            Game.PlayersPointsPerGame[playerId] -= 50;
                    }

                    continue;
                }
                if (GameStatus.WhiteClock <=0)
                {
                    if (playerId == Game.Room.Players.First(p => p.Color == "white").Id)
                    {
                        Game.PlayersPointsPerGame[playerId] -= 50;
                    }
                    else
                    {
                        Game.PlayersPointsPerGame[playerId] += 100;
                    }

                    continue;
                }
                if (GameStatus.BlackClock <= 0)
                {
                    if (playerId == Game.Room.Players.First(p => p.Color == "black").Id)
                    {
                        Game.PlayersPointsPerGame[playerId] -= 50;
                    }
                    else
                    {
                        Game.PlayersPointsPerGame[playerId] += 100;
                    }

                    continue;
                }
                if (!Moved) // assign points to a player who last moved
                {
                    if (playerId == GameStatus.CurrentPlayerId)
                        Game.PlayersPointsPerGame[playerId] -= 50;
                    else
                        Game.PlayersPointsPerGame[playerId] += 100;
                }
            }
        }
    }
}