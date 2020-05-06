using SpaceDuck.Common.Models;
using SpaceDuck.KalamburyGame.Services;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.Server
{
    public interface IGameServer
    {
        public IGameHelper gameHelper { get; }
        Task CreateGame(int roomId);
        Task CreateGame(GameTask gameTask);
        void UpdateGameStatus(string gameId, GameStatus gameStatus);
    }

    public class GameServer : IGameServer
    {
        private IKalaburyService kalaburyService;
        private IGameMiddleware gameMiddleware;
        public IGameHelper gameHelper { get; }

        public GameServer(IKalaburyService kalaburyService,
            IGameMiddleware gameMiddleware,
            IGameHelper gameHelper)
        {
            this.kalaburyService = kalaburyService;

            this.gameMiddleware = gameMiddleware;

            this.gameHelper = gameHelper;

            Thread thread = new Thread(StartServer);
            thread.Start();
        }

        private void StartServer()
        {
            Func<Task<string>> generateWordMethod = kalaburyService.GetWord;
            Func<Game, string> generateCurrentPlayerMethod = kalaburyService.SelectCurrentPlayer;
            Console.WriteLine("Server started.");

            while (true)
            {
                Console.WriteLine($"Game count: {gameHelper.gameTasks.Count}");
                Console.WriteLine($"Running game count: {gameHelper.gameTasks.Where(g => g.IsStarted).ToList().Count}");

                foreach (var gameTask in gameHelper.gameTasks)
                {
                    if (!gameTask.IsStarted)
                        continue;

                    gameTask.CheckRound();

                    gameTask.CheckStatus();

                    if (gameTask.IsFinshed)
                    {
                        if (!gameTask.WasGuessed)
                            gameTask.UpdatePoints(null);
                        gameMiddleware.SendPoints(gameTask.Game.Room.Id.ToString(), gameTask.Game.PlayersPointsPerGame);
                        gameMiddleware.SendMesage(gameTask.Game.Room.Id.ToString(), $"Koniec rundy, hasło: {gameTask.GameStatus.Word}");
                        gameTask.GenerateNewRound(generateWordMethod, generateCurrentPlayerMethod);

                        continue;
                    }

                    if (gameTask.IsEnded)
                    {
                        kalaburyService.UpdateUsersPoints(gameTask.Game.PlayersPointsPerGame);
                        gameTask.GameStatus.IsFinished = true;
                        gameMiddleware.SendMesage(gameTask.Game.Room.Id.ToString(), "Koniec gry");
                        continue;
                    }

                    gameMiddleware.SendGameStatus(gameTask.Game.Room.Id.ToString(), gameTask.GameStatus);
                }

                gameHelper.gameTasks.RemoveAll(game => game.IsEnded);


                Thread.Sleep(1000);
            }
            Console.WriteLine("Server ended.");
        }

        public async Task CreateGame(int roomId)
        {
            Func<Task<string>> generateWordMethod = kalaburyService.GetWord;
            Func<Game, string> generateCurrentPlayerMethod = kalaburyService.SelectCurrentPlayer;

            var gameTask = gameHelper.gameTasks.FirstOrDefault(game => game.Game.Room.Id == roomId);

            await gameTask.GenerateNewRound(generateWordMethod, generateCurrentPlayerMethod);

            gameMiddleware.SendGameStatus(gameTask.Game.Room.Id.ToString(), gameTask.GameStatus);
            gameMiddleware.SendPoints(gameTask.Game.Room.Id.ToString(), gameTask.Game.PlayersPointsPerGame);

            gameTask.IsStarted = true;
        }

        public void UpdateGameStatus(string gameId, GameStatus gameStatus)
        {
            throw new NotImplementedException();
        }

        public async Task CreateGame(GameTask gameTask)
        {
            gameHelper.gameTasks.Add(gameTask);

            CreateGame(gameTask.Game.Room.Id);
        }
    }


}
