using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ApiAlumnos.Filters
{
    public class ApiKeyAuthAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var config = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
            var apiKey = config["ApiKey"];

            if (!context.HttpContext.Request.Headers.TryGetValue("X-API-KEY", out var providedKey))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            if (!apiKey.Equals(providedKey))
            {
                context.Result = new UnauthorizedResult();
            }
        }
    }
}
