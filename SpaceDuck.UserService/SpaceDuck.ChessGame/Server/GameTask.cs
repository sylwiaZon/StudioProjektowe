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
        public Common.Models.ChessGame Game { get; set; }

        public bool Resigned => GameStatus.ResignedPlayerId != "";


        public GameTask(ChessGameStatus gameStatus, Common.Models.ChessGame game)
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
            if (GameStatus.TurnTime > Game.Room.RoomConfiguration.RoundDuration)
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

        public async Task GenerateNewRound(Func<Game, string> generateCurrentPlayer)
        {
            GameStatus.CurrentPlayerId = generateCurrentPlayer(Game);
            GameStatus.TurnTime = 0;
            Moved = false;
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