using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace back_end.Helpers
{
    public class CustomerAutheticationSchemeProvider : AuthenticationSchemeProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CustomerAutheticationSchemeProvider(IOptions<AuthenticationOptions> options, IHttpContextAccessor httpContextAccessor) : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public override async Task<AuthenticationScheme> GetDefaultAuthenticateSchemeAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext!.Request.Path.StartsWithSegments("/admin"))
            {
                return await GetSchemeAsync("AdminAuth");
            }
            else
            {
                return await GetSchemeAsync("CustomerAuth");
            }
        }
    }
}
