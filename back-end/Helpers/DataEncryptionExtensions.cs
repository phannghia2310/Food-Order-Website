using System.Runtime.Intrinsics.Arm;
using System.Security.Cryptography;
using System.Text;

namespace back_end.Helpers
{
    public static class DataEncryptionExtensions
    {
        #region [Hashing Extension]
        public static string ToSHA256Hash(this string password, string? saltKey)
        {
            var sha256 = SHA256.Create();
            byte[] encrytpedSHA256 = sha256.ComputeHash(Encoding.UTF8.GetBytes(string.Concat(password, saltKey)));
            sha256.Clear();

            return Convert.ToBase64String(encrytpedSHA256);
        }

        public static string ToSHA512Hash(this string password, string? saltKey)
        {
            var sha512 = SHA512.Create();
            byte[] encrytpedSHA512 = sha512.ComputeHash(Encoding.UTF8.GetBytes(string.Concat(password, saltKey)));
            sha512.Clear();

            return Convert.ToBase64String(encrytpedSHA512);
        }

        public static string toMd5Hash(this string password, string? saltKey)
        {
            using(var md5 = MD5.Create())
            {
                byte[] data = md5.ComputeHash(Encoding.UTF8.GetBytes(string.Concat(password, saltKey)));
                StringBuilder stringBuilder = new StringBuilder();
                for(int i=0; i<data.Length; i++)
                {
                    stringBuilder.Append(data[i].ToString("x2"));
                }

                return stringBuilder.ToString();
            }
        }

        #endregion
    }
}
