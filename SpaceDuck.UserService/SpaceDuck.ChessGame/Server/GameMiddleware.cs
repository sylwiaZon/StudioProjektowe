using SpaceDuck.Common.Models;
using SpaceDuck.ChessGame.Hubs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceDuck.ChessGame.Server
{
    public interface IGameMiddleware
    {
        Task SendMesage(string gameId, string message);
        Task SendGameStatus(string gameId, ChessGameStatus gameStatus);
        Task SendPoints(string gameId, Dictionary<string, int> points);
    }

    public class GameMiddleware : IGameMiddleware
    {
        private IChessHub _chessHub;

        public GameMiddleware(IChessHub chessHub)
        {
            _chessHub = chessHub;
        }

        public async Task SendGameStatus(string gameId, ChessGameStatus gameStatus)
        {
            await _chessHub.SendGameStatus(gameId, gameStatus);
        }

        public async Task SendMesage(string gameId, string message)
        {
            await _chessHub.SendMesage(gameId, message);
        }


        public async Task SendPoints(string gameId, Dictionary<string, int> points)
        {
            await _chessHub.SendPoints(gameId, points);
        }
    }
}
