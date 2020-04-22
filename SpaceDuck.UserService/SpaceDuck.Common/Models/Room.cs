using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SpaceDuck.Common.Models
{
    public class Room
    {
        [Key]
        public int Id { get; set; }
        public GameType GameType { get; set; }
        public RoomConfiguration RoomConfiguration { get; set; }
        public List<string> PlayersIds { get; set; }
        public bool IsFull { get; set; }
    }
}
