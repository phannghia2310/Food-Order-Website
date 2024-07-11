using System.Text;

namespace back_end.Helpers
{
    public class MyUtils
    {
        public static string UploadHinh(IFormFile Hinh, string folder)
        {
            try
            {
                var fileName = Path.GetFileNameWithoutExtension(Hinh.FileName) + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + Path.GetExtension(Hinh.FileName);
                var fulPath = Path.Combine(Directory.GetCurrentDirectory(), "Image", folder, fileName);
                using (var myFile = new FileStream(fulPath, FileMode.CreateNew))
                {
                    Hinh.CopyTo(myFile);
                }
                return Path.Combine(folder, fileName).Replace("\\", "/");
            }
            catch (Exception ex)
            {
                return string.Empty;
            }
        }

        public static string GenerateRandomKey(int length = 5)
        {
            var pattern = @"qazwsxedcrfvtgbyhnujmikolpQAZWSXEDCRFVTGBYHNUJMIKOLP!";
            var sb = new StringBuilder();
            var rd = new Random();

            for (int i = 0; i < length; i++)
            {
                sb.Append(pattern[rd.Next(0, pattern.Length)]);
            }

            return sb.ToString();
        }
    }
}
