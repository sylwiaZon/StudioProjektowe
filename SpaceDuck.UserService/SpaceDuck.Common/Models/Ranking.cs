using System.ComponentModel.DataAnnotations;

namespace SpaceDuck.Common.Models
{
    public class Ranking
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; }
        public GameType GameType { get; set; }
        public int Points { get; set; }
    }
}
