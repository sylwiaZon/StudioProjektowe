using SpaceDuck.Common.Models;
using SpaceDuck.KalamburyGame.Hubs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.Server
{
    public interface IGameMiddleware
    {
        Task SendMesage(string gameId, string message);
        Task SendGameStatus(string gameId, GameStatus gameStatus);
        Task SendPoints(string gameId, Dictionary<string, int> points);
    }

    public class GameMiddleware : IGameMiddleware
    {
        private IKalamburyHub _kalamburyHub;

        public GameMiddleware(IKalamburyHub kalamburyHub)
        {
            _kalamburyHub = kalamburyHub;
        }

        public async Task SendGameStatus(string gameId, GameStatus gameStatus)
        {
            await _kalamburyHub.SendGameStatus(gameId, gameStatus);
        }

        public async Task SendMesage(string gameId, string message)
        {
            await _kalamburyHub.SendMesage(gameId, message);
        }

        public async Task SendPoints(string gameId, Dictionary<string, int> points)
        {
            await _kalamburyHub.SendPoints(gameId, points);
        }
    }
}
