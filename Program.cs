using Microsoft.EntityFrameworkCore;
using project.Data;
using project.Services;

var builder = WebApplication.CreateBuilder(args);


// Lấy chuỗi kết nối từ appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<TodoContext>(opt =>
    opt.UseSqlServer(connectionString)
);

builder.Services.AddScoped<ITodoService, TodoService>();


// --- 3. Cấu hình CORS (Để Frontend kết nối) ---
const string FrontendPolicy = "FrontendPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: FrontendPolicy,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                    
                      });
});


builder.Services.AddControllers();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


// Cấu hình cho môi trường Phát triển (Development)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Sử dụng CORS (ĐẶT TRƯỚC MapControllers)
app.UseCors(FrontendPolicy);

// Xử lý xác thực người dùng (Authentication)
// app.UseAuthentication(); // Thường đặt trước Authorization

app.UseAuthorization();
app.MapControllers();
app.Run();