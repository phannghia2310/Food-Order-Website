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

var builder = WebApplication.CreateBuilder(args);

Env.Load();

// Add services to the container.
builder.Configuration.AddEnvironmentVariables();

var envConnectionString = Environment.GetEnvironmentVariable("FOODORDER_DB_CONNECTION_STRING");
var envJwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
var envJwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
var envJwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
var envJwtExpiryDuration = Environment.GetEnvironmentVariable("JWT_EXPIRY_DURATION_IN_MINUTES");
var envPaypalAppId = Environment.GetEnvironmentVariable("PAYPAL_APP_ID");
var envPaypalAppSecret = Environment.GetEnvironmentVariable("PAYPAL_APP_SECRET");
var envPaypalMode = Environment.GetEnvironmentVariable("PAYPAL_MODE");
var envVnPayTmnCode = Environment.GetEnvironmentVariable("VNPAY_TMNCODE");
var envVnPayHashSecret = Environment.GetEnvironmentVariable("VNPAY_HASH_SECRET");
var envVnPayBaseUrl = Environment.GetEnvironmentVariable("VNPAY_BASE_URL");
var envVnPayVersion = Environment.GetEnvironmentVariable("VNPAY_VERSION");
var envVnPayCommand = Environment.GetEnvironmentVariable("VNPAY_COMMAND");
var envVnPayCurrCode = Environment.GetEnvironmentVariable("VNPAY_CURR_CODE");
var envVnPayLocale = Environment.GetEnvironmentVariable("VNPAY_LOCALE");
var envVnPayPaymentBackReturnUrl = Environment.GetEnvironmentVariable("VNPAY_PAYMENT_BACK_RETURN_URL");
var envGoogleClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
var envGoogleClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");

if (envConnectionString != null) builder.Configuration["ConnectionStrings:FoodOrder"] = envConnectionString;
if (envJwtKey != null) builder.Configuration["Jwt:Key"] = envJwtKey;
if (envJwtIssuer != null) builder.Configuration["Jwt:Issuer"] = envJwtIssuer;
if (envJwtAudience != null) builder.Configuration["Jwt:Audience"] = envJwtAudience;
if (envJwtExpiryDuration != null) builder.Configuration["Jwt:ExpiryDurationInMinutes"] = envJwtExpiryDuration;
if (envPaypalAppId != null) builder.Configuration["PaypalOptions:AppId"] = envPaypalAppId;
if (envPaypalAppSecret != null) builder.Configuration["PaypalOptions:AppSecret"] = envPaypalAppSecret;
if (envPaypalMode != null) builder.Configuration["PaypalOptions:Mode"] = envPaypalMode;
if (envVnPayTmnCode != null) builder.Configuration["VnPayOptions:TmnCode"] = envVnPayTmnCode;
if (envVnPayHashSecret != null) builder.Configuration["VnPayOptions:HashSecret"] = envVnPayHashSecret;
if (envVnPayBaseUrl != null) builder.Configuration["VnPayOptions:BaseUrl"] = envVnPayBaseUrl;
if (envVnPayVersion != null) builder.Configuration["VnPayOptions:Version"] = envVnPayVersion;
if (envVnPayCommand != null) builder.Configuration["VnPayOptions:Command"] = envVnPayCommand;
if (envVnPayCurrCode != null) builder.Configuration["VnPayOptions:CurrCode"] = envVnPayCurrCode;
if (envVnPayLocale != null) builder.Configuration["VnPayOptions:Locale"] = envVnPayLocale;
if (envVnPayPaymentBackReturnUrl != null) builder.Configuration["VnPayOptions:PaymentBackReturnUrl"] = envVnPayPaymentBackReturnUrl;
if (envGoogleClientId != null) builder.Configuration["GoogleKeys:ClientId"] = envGoogleClientId;
if (envGoogleClientSecret != null) builder.Configuration["GoogleKeys:ClientSecret"] = envGoogleClientSecret;

builder.Services.AddControllers();
builder.Services.AddDbContext<FoodOrderContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("FoodOrder"));
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
    builder.Configuration["PaypalOptions:AppId"],
    builder.Configuration["PaypalOptions:AppSecret"],
    builder.Configuration["PaypalOptions:Mode"]
));
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
    });
builder.Services.AddScoped<FoodOrderContext>();
builder.Services.AddScoped<UserService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        });
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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
builder.Services.AddSignalR();
builder.Services.AddTransient<IEmailSender, EmailSender>();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();  // Log to console
builder.Logging.AddDebug();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
    });
}

//app.UseCors("AllowSpecificOrigin");
//app.UseCors("CustomerPolicy");

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
});

app.Use(async (context, next) =>
{
    string nonce = "MPZW9bE7mUQpuI/pppVhboQ/YxYRXp8LAnLHDAgom0mxyQkB"; // Implement a function to generate a nonce
    context.Response.Headers.Add("Content-Security-Policy",
        $"script-src 'nonce-{nonce}' 'self' https://*.paypal.com ...");

    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "SAMEORIGIN");
    context.Response.Headers.Add("X-Xss-Protection", "1; mode=block");

    await next();
});

app.MapControllerRoute(
    name: "MyArea",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}")
    .RequireCors("AllowSpecificOrigin");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .RequireCors("CustomerPolicy");

app.Run();
