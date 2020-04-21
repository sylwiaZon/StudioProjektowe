using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace SpaceDuck.Common.Models
{
    public class Room
    {
        [Key]
        public int Id { get; set; }
        public GameType GameType { get; set; }
        public int RoomConfigurationid { get; set; }
        [ForeignKey("RoomConfigurationid")]
        public virtual RoomConfiguration RoomConfiguration { get; set; }
        [NotMapped]
        public List<string> PlayersIds { get; set; }
        public string PlayerIdsFlat
        {
            get { return string.Join(',', PlayersIds); }
            set { PlayersIds = value.Split(',').ToList(); }
        }
        public bool IsFull { get; set; }
    }
}
