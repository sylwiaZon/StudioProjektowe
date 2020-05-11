using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

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
        public List<Player> Players { get; set; }
        public string PlayerIdsFlat
        {
            get {
                StringBuilder sb = new StringBuilder();

                foreach (var item in Players)
                {
                    sb.Append($"{item.Id}:{item.Name},");
                }
                sb.Remove(sb.Length - 1, 1);

                return sb.ToString();
            }
            set {
                var players = value.Split(',').ToList();

                Players = new List<Player>();
                foreach (var item in players)
                {
                    var values = item.Split(':').ToArray();
                    var player = new Player();
                    player.Id = values[0];
                    if (values.Length > 1)
                        player.Name = values[1];
                    else
                        player.Name = "";
                    Players.Add(player);
                }
            }
        }
        public bool IsFull { get; set; }
    }

    public class Player
    {
        public string Id { get; set; }
        public string Name { get; set; }


    }
}
