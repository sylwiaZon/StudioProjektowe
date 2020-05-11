using System.Net.Http;
using System.Threading.Tasks;

namespace SpaceDuck.ChineseGame.Services
{
    public class ApiService
    {
        private static HttpClient Client;
        private readonly string Path = "http://www.kalambury.org/lib/generate.php";

        public ApiService()
        {
            Client = new HttpClient();
        }

        public async Task<string> GetWord()
        {
            return await Get(Path);
        }

        public async Task<string> GetWord(string path)
        {
            return await Get(path);
        }

        private async Task<string> Get(string path)
        {
            var word = "";
            HttpResponseMessage response = await Client.GetAsync(path);
            if (response.IsSuccessStatusCode)
            {
                word = await response.Content.ReadAsStringAsync();
            }

            if (word.Contains("div"))
            {
                var a = word.Remove(0, word.IndexOf(">") + 1);
                var b = a.Remove(a.IndexOf("<"));
                return b;
            }
                
            return word;
        }
    }
}
