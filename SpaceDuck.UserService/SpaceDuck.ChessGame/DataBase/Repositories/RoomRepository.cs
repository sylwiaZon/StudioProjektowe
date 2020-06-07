using SpaceDuck.Common.Models;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ChessGame.DataBase.Repositories
{
    public interface IRoomRepository
    {
        IQueryable<Room> Rooms { get; }
        Task SaveRoom(Room room);
        void DeleteRoom(int roomId);
        Task<Room> GetRoomWitConfig(int roomId);
    }

    public class RoomRepository : IRoomRepository
    {
        private ApplicationDataDbContext context;

        public RoomRepository(ApplicationDataDbContext dataContext)
        {
            context = dataContext;
        }

        public IQueryable<Room> Rooms => context.Rooms;

        public async Task<Room> GetRoomWitConfig(int roomId)
        {
            var room = context.Rooms.FirstOrDefault(rm => rm.Id == roomId);
            if (room == null)
            {
                return null;
            }
            await context.Entry(room).Reference(r => r.RoomConfiguration).LoadAsync();

            return room;
        }

        public void DeleteRoom(int roomId)
        {
            Room dbEntry = context.Rooms
                .FirstOrDefault(data => data.Id == roomId);

            if (dbEntry != null)
            {
                context.Rooms.Remove(dbEntry);
                context.SaveChanges();
            }
        }

        public async Task SaveRoom(Room room)
        {
            if (room.Id == 0)
            {
                await context.AddAsync(room);
            }
            else
            {
                context.Entry(room).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            }

            await context.SaveChangesAsync();
        }
    }
}