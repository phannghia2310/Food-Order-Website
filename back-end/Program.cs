using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using back_end.Data;
using back_end.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using back_end.Helpers;
using back_end.Hubs;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Azure.Storage.Blobs;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

// Add services to the container.
builder.Configuration.AddEnvironmentVariables();

var envVars = new Dictionary<string, string>
{
    { "FOODORDER_DB_CONNECTION_STRING", "ConnectionStrings:FoodOrder" },
    { "JWT_KEY", "Jwt:Key" },
    { "JWT_ISSUER", "Jwt:Issuer" },
    { "JWT_AUDIENCE", "Jwt:Audience" },
    { "JWT_EXPIRY_DURATION_IN_MINUTES", "Jwt:ExpiryDurationInMinutes" },
    { "PAYPAL_APP_ID", "PaypalOptions:AppId" },
    { "PAYPAL_APP_SECRET", "PaypalOptions:AppSecret" },
    { "PAYPAL_MODE", "PaypalOptions:Mode" },
    { "VNPAY_TMNCODE", "VnPayOptions:TmnCode" },
    { "VNPAY_HASH_SECRET", "VnPayOptions:HashSecret" },
    { "VNPAY_BASE_URL", "VnPayOptions:BaseUrl" },
    { "VNPAY_VERSION", "VnPayOptions:Version" },
    { "VNPAY_COMMAND", "VnPayOptions:Command" },
    { "VNPAY_CURR_CODE", "VnPayOptions:CurrCode" },
    { "VNPAY_LOCALE", "VnPayOptions:Locale" },
    { "VNPAY_PAYMENT_BACK_RETURN_URL", "VnPayOptions:PaymentBackReturnUrl" },
    { "GOOGLE_CLIENT_ID", "GoogleKeys:ClientId" },
    { "GOOGLE_CLIENT_SECRET", "GoogleKeys:ClientSecret" },
    { "AZURE_SIGNALR_CONNECTION_STRING", "Azure:SignalR:ConnectionString" },
    { "AZURE_BLOB_STORAGE_CONNECTION_STRING", "AzureBlobStorage:ConnectionString" },
    { "AZURE_BLOB_STORAGE_CONTAINER_NAME", "AzureBlobStorage:ContainerName"}
};

foreach (var envVar in envVars)
{
    var envValue = Environment.GetEnvironmentVariable(envVar.Key);
    if (envValue != null)
    {
        builder.Configuration[envVar.Value] = envValue;
    }
}

builder.Services.AddControllers();

builder.Services.AddDbContext<FoodOrderContext>(options =>
{
    options.UseSqlServer(builder.Configuration["ConnectionStrings:FoodOrder"]);
});
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromSeconds(5);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSingleton<IVnPayService, VnPayService>();
builder.Services.AddSingleton<IAuthenticationSchemeProvider, CustomerAutheticationSchemeProvider>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddSingleton(x => new PaypalClient(
    clientId: builder.Configuration["PaypalOptions:AppId"]!,
    clientSecret: builder.Configuration["PaypalOptions:AppSecret"]!,
    mode: builder.Configuration["PaypalOptions:Mode"]!
));
builder.Services.AddSingleton(new BlobServiceClient(builder.Configuration["AzureBlobStorage:ConnectionString"]));
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddGoogle(options =>
    {
        options.ClientId = builder.Configuration["GoogleKeys:ClientId"]!;
        options.ClientSecret = builder.Configuration["GoogleKeys:ClientSecret"]!;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("Authentication failed: " + context.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validated for user: " + context.Principal!.Identity!.Name);
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                Console.WriteLine("OnChallenge error: " + context.ErrorDescription);
                return Task.CompletedTask;
            }
        };
    })
    .AddCookie("CustomerAuth", options =>
    {
        options.LoginPath = "/customer/auth/signin";
    })
    .AddCookie("AdminAuth", options =>
    {
        options.LoginPath = "/admin/user/login";
    });
builder.Services.AddScoped<FoodOrderContext>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IDialogService, DialogService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });

    options.DocInclusionPredicate((_, apiDesc) =>
    {
        if (!apiDesc.TryGetMethodInfo(out var methodInfo)) return false;
        return true;
    });

    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = System.IO.Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});
builder.Services.AddSignalR().AddAzureSignalR(builder.Configuration["Azure:SignalR:ConnectionString"]);
builder.Services.AddTransient<IEmailSender, EmailSender>();

builder.Services.AddHealthChecks();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();  // Log to console
builder.Logging.AddDebug();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
    });
}

app.UseCors("AllowAllOrigins");

app.UseSession();

app.UseRouting();

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseAuthentication();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    _ = endpoints.MapHub<ChatHub>("/chatHub");
    _ = endpoints.MapHealthChecks("/health");
    _ = endpoints.MapControllers();
});

app.Use(async (context, next) =>
{
    string nonce = "MPZW9bE7mUQpuI/pppVhboQ/YxYRXp8LAnLHDAgom0mxyQkB"; // Implement a function to generate a nonce
    context.Response.Headers.Append("Content-Security-Policy",
        $"script-src 'nonce-{nonce}' 'self' https://*.paypal.com ...");

    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "SAMEORIGIN");
    context.Response.Headers.Append("X-Xss-Protection", "1; mode=block");

    await next();
});

app.MapControllerRoute(
    name: "MyArea",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}")
    .RequireCors("AllowAllOrigins");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .RequireCors("AllowAllOrigins");

app.Run();
