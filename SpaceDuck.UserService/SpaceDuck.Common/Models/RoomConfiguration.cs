using System;

namespace SpaceDuck.Common.Models
{
    public class RoomConfiguration
    {
        public string PlayerOwnerId { get; set; }
        public TimeSpan GameDuration { get; set; }
        public int NumberOfPlayers { get; set; }
        public bool IsPrivate { get; set; }
        public string Password { get; set; }
    }
}
