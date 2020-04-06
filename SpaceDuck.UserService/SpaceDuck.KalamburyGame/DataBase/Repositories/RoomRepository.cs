﻿using SpaceDuck.Common.Models;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.DataBase.Repositories
{
    public interface IRoomRepository
    {
        IQueryable<Room> Rooms { get; }
        Task SaveRoom(Room room);
        void DeleteRoom(int roomId);
    }

    public class RoomRepository : IRoomRepository
    {
        private ApplicationDataDbContext context;

        public RoomRepository(ApplicationDataDbContext dataContext)
        {
            context = dataContext;
        }

        public IQueryable<Room> Rooms => context.Rooms;

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
