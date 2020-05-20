using SpaceDuck.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ChessGame.Server
{
    public class GameTask
    {
        public bool IsStarted { get; set; } = false;
        public bool IsFinshed { get; set; } = false;
        public bool IsEnded { get; set; } = false;
        public bool Resigned { get; set; }
        public bool DrawOffered { get; set; }
        public bool DrawAccepted { get; set; }
        private int DurationTime = 0;
        public string PreviousBoard { get; set; } = "";
        private int Round = 0;
        public ChessGameStatus GameStatus { get; set; }
        public Common.Models.ChessGame Game { get; set; }


        public GameTask(ChessGameStatus gameStatus, Common.Models.ChessGame game)
        {
            GameStatus = gameStatus;
            Game = game;
        }

        public void CheckRound()
        {
            if (DurationTime > Game.Room.RoomConfiguration.RoundDuration)
            {
                IsFinshed = true;
                IsEnded = !CheckIfMoveWasMade();
            }

            //if (CheckIfMoveWasMade()) IsFinshed = true;

            //if () sprawdź czy zbity król
            //{
            //    IsEnded = true;
            //}

            DurationTime++;
            GameStatus.RoundTime++;
        }

        public void CheckStatus()
        {
            if (GameStatus.IsFinished) IsFinshed = true;
            if (GameStatus.DrawOffered)  DrawOffered = true;
            if (GameStatus.DrawAccepted)
            {
                DrawAccepted = true;
                IsEnded = true;
            }
            if (GameStatus.Resigned) {
                Resigned = true;
                IsEnded = true;
            }
        }


        public async Task GenerateNewRound(Func<Game, string> generateCurrentPlayer)
        {
            GameStatus.CurrentPlayerId = generateCurrentPlayer(Game);
            GameStatus.IsFinished = false;
            GameStatus.DrawOffered = false;
            GameStatus.DrawAccepted = false;
            GameStatus.Resigned = false;
            GameStatus.Round++;
            GameStatus.RoundTime = 0;
            DurationTime = 0;
            Round++;
            IsFinshed = false;
            DrawOffered = false;
            DrawAccepted = false;
            Resigned = false;
            PreviousBoard = GameStatus.Board;
        }

        public bool CheckIfMoveWasMade()
        {
            if (string.Compare(GameStatus.Board, PreviousBoard) == 0) return false;
            else return true;
        }

        public void UpdatePoints()
        {
            foreach (var player in Game.PlayersPointsPerGame)
            {
                if (DrawAccepted) {
                    Game.PlayersPointsPerGame[player.Key] += 0;
                    continue;
                }
                if (Resigned) {
                    if (player.Key == GameStatus.CurrentPlayerId)
                        Game.PlayersPointsPerGame[player.Key] -= 70;
                    else
                        Game.PlayersPointsPerGame[player.Key] += 100;
                }
                if (!Resigned && !DrawAccepted) {
                    if (player.Key == GameStatus.CurrentPlayerId)
                        Game.PlayersPointsPerGame[player.Key] += 100;
                    else
                        Game.PlayersPointsPerGame[player.Key] -= 50;
                }
            }
        }
    }
}
