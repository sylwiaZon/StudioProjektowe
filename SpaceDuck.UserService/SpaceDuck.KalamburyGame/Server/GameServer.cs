using SpaceDuck.Common.Models;
using SpaceDuck.KalamburyGame.Hubs;
using SpaceDuck.KalamburyGame.Services;
using System;
using System.Collections.Generic;
using System.Threading;

namespace SpaceDuck.KalamburyGame.Server
{
    public interface IGameServer
    {
        void CreateGame(GameTask gameTask);
        void UpdateGameStatus(string gameId, GameStatus gameStatus);
    }

    public class GameServer : IGameServer
    {
        private IKalaburyService kalaburyService;
        private IKalamburyHub kalamburyHub;

        private List<GameTask> gameTasks;

        public GameServer(IKalaburyService kalaburyService,
            IKalamburyHub kalamburyHub)
        {
            this.kalaburyService = kalaburyService;

            this.kalamburyHub = kalamburyHub;
            gameTasks = new List<GameTask>();

            Thread thread = new Thread(StartServer);
            thread.Start();
        }

        private void StartServer()
        {
            Func<string> generateWordMethod = kalaburyService.GetWord;
            Func<Game, string> generateCurrentPlayerMethod = kalaburyService.SelectCurrentPlayer;
            Console.WriteLine("Server started.");

            while (true)
            {
                Console.WriteLine($"Game count: {gameTasks.Count}");

                foreach (var gameTask in gameTasks)
                {
                    gameTask.CheckRound();

                    gameTask.CheckStatus();

                    if (gameTask.IsFinshed)
                    {
                        gameTask.GenerateNewRound(generateWordMethod, generateCurrentPlayerMethod);
                        kalamburyHub.SendGameStatus("1234", gameTask.GameStatus);
                    }

                    if (gameTask.IsEnded)
                    {
                        gameTask.GameStatus.IsFinished = true;
                        kalamburyHub.SendGameStatus(gameTask.Game.Room.Id.ToString(), gameTask.GameStatus);
                    }
                }

                Thread.Sleep(1000);
            }
            Console.WriteLine("Server ended.");
        }

        public void CreateGame(GameTask gameTask)
        {
            Func<string> generateWordMethod = kalaburyService.GetWord;
            Func<Game, string> generateCurrentPlayerMethod = kalaburyService.SelectCurrentPlayer;

            gameTask.GenerateNewRound(generateWordMethod, generateCurrentPlayerMethod);

            kalamburyHub.SendGameStatus(gameTask.Game.Room.Id.ToString(), gameTask.GameStatus);

            gameTasks.Add(gameTask);
        }

        public void UpdateGameStatus(string gameId, GameStatus gameStatus)
        {
            throw new NotImplementedException();
        }
    }

    public class GameTask
    {
        public bool IsFinshed { get; set; } = false;
        public bool IsEnded { get; set; } = false;
        private int DurationTime = 0;
        private int Round = 0;
        public GameStatus GameStatus { get; set; }
        public Game Game { get; set; }


        public GameTask(GameStatus gameStatus, Game game)
        {
            GameStatus = gameStatus;
            Game = game;
        }

        public void CheckRound()
        {
            if (DurationTime > Game.Room.RoomConfiguration.RoundDuration)
            {
                IsFinshed = true;
            }

            if (Round > Game.Room.RoomConfiguration.RoundCount)
            {
                IsEnded = true;
            }

            DurationTime++;
        }

        public void CheckStatus()
        {
            if (GameStatus.IsFinished) IsFinshed = true;
        }

        public void GenerateNewRound(Func<string> generateWord, Func<Game, string> generateCurrentPlayer)
        {
            GameStatus.Word = generateWord();
            GameStatus.CurrentPlayerId = generateCurrentPlayer(Game);
            DurationTime = 0;
            Round++;
        }
    }
}
