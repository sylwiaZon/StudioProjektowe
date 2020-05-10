using System;

namespace SpaceDuck.Common.Models
{
    public class RoomConfiguration
    {
        public int RoomConfigurationid { get; set; }
        public string PlayerOwnerId { get; set; }
        public string PlayerOwnerName { get; set; }
        public int RoundDuration { get; set; }
        public int NumberOfPlayers { get; set; }
        public bool IsPrivate { get; set; }
        public string Password { get; set; }
        public int RoundCount { get; set; }
        public virtual Room Room { get; set; }
    }
}
