using SpaceDuck.Common.Models;
using SpaceDuck.ChessGame.Services;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaceDuck.ChessGame.Server
{
    public interface IGameServer
    {
        IGameHelper gameHelper { get; }
        Task CreateGame(int roomId);
        Task CreateGame(GameTask gameTask);
    }

    public class GameServer : IGameServer
    {
        private IChessService chessService;
        private IGameMiddleware gameMiddleware;
        public IGameHelper gameHelper { get; }

        public GameServer(IChessService chessService,
            IGameMiddleware gameMiddleware,
            IGameHelper gameHelper)
        {
            this.chessService = chessService;

            this.gameMiddleware = gameMiddleware;

            this.gameHelper = gameHelper;

            Thread thread = new Thread(StartServer);
            thread.Start();
        }

        private void StartServer()
        {
            Console.WriteLine("Server started.");

            while (true)
            {
                Console.WriteLine($"Game count: {gameHelper.gameTasks.Count}");
                Console.WriteLine($"Running game count: {gameHelper.gameTasks.Where(g => g.IsStarted).ToList().Count}");

                foreach (var gameTask in gameHelper.gameTasks)
                {
                    if (!gameTask.IsStarted)
                        continue;

                    gameTask.UpdateClocks();

                    gameTask.UpdateGameStatus();

                    if (gameTask.Moved)
                    {
                        gameTask.ChangeTurn();
                        continue;
                    }

                    if (gameTask.GameStatus.IsFinished)
                    {
                        if (gameTask.Resigned)
                            gameMiddleware.SendMesage(gameTask.Game.Room.Id.ToString(), $"Rezygnacja gracza {gameTask.Game.Room.Players.First(p => p.Id == gameTask.GameStatus.CurrentPlayerId).Name}");
                        if (gameTask.GameStatus.DrawAccepted)
                            gameMiddleware.SendMesage(gameTask.Game.Room.Id.ToString(), "Remis");
                        gameMiddleware.SendMesage(gameTask.Game.Room.Id.ToString(), "Koniec gry");
                        gameTask.UpdatePoints();
                        chessService.UpdateUsersPoints(gameTask.Game.PlayersPointsPerGame);
                        gameMiddleware.SendPoints(gameTask.Game.Room.Id.ToString(), gameTask.Game.PlayersPointsPerGame);
                        continue;
                    }

                    gameMiddleware.SendGameStatus(gameTask.Game.Room.Id.ToString(), gameTask.GameStatus);
                }

                gameHelper.gameTasks.RemoveAll(game => game.GameStatus.IsFinished);

                Thread.Sleep(1000);
            }
            Console.WriteLine("Server ended.");
        }

        public async Task CreateGame(int roomId)
        {
            var gameTask = gameHelper.gameTasks.First(game => game.Game.Room.Id == roomId);

            gameTask.GameStatus.CurrentPlayerId = gameTask.Game.Room.Players.First(p => p.Color == "white").Id;

            await gameMiddleware.SendGameStatus(gameTask.Game.Room.Id.ToString(), gameTask.GameStatus);
            await gameMiddleware.SendPoints(gameTask.Game.Room.Id.ToString(), gameTask.Game.PlayersPointsPerGame);

            gameTask.IsStarted = true;
        }


        public async Task CreateGame(GameTask gameTask)
        {
            gameHelper.gameTasks.Add(gameTask);

            await CreateGame(gameTask.Game.Room.Id);
        }
    }

}
