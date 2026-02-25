using System.Diagnostics;

namespace ex1.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;
    
    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var requestPath = context.Request.Path;
        var requestMethod = context.Request.Method;
        
        _logger.LogInformation("Incoming Request: {Method} {Path}", requestMethod, requestPath);
        
        try
        {
            await _next(context);
            
            stopwatch.Stop();
            var statusCode = context.Response.StatusCode;
            var elapsed = stopwatch.ElapsedMilliseconds;
            
            _logger.LogInformation(
                "Completed {Method} {Path} responded {StatusCode} in {Duration}ms",
                requestMethod, requestPath, statusCode, elapsed);
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex, 
                "Failed {Method} {Path} after {Duration}ms",
                requestMethod, requestPath, stopwatch.ElapsedMilliseconds);
            throw;
        }
    }
}
