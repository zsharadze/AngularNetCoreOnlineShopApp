using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ASPNetCoreWebApi.Infrastructure
{

    public class BadRequestActionFilter : IActionFilter
    {
        Dictionary<string, List<string>> errorMessages = new Dictionary<string, List<string>>() { { "errors", new List<string>() } };

        public BadRequestActionFilter()
        {

        }

        //this one will catch model binding badRequest errors
        public void OnActionExecuting(ActionExecutingContext actionContext)
        {
            if (!actionContext.ModelState.IsValid)
            {
                actionContext.ModelState.ToList().ForEach(argument =>
                {
                    if (argument.Value?.ValidationState == ModelValidationState.Invalid)
                    {
                        argument.Value.Errors.ToList().ForEach(error =>
                        {
                            errorMessages["errors"].Add(error.ErrorMessage);
                        });
                    }
                });

                actionContext.Result = new BadRequestObjectResult(errorMessages);
            }
        }

        //this one will catch badRequest ModelState.AddModelError from controllers
        public void OnActionExecuted(ActionExecutedContext actionContext)
        {
            if (!actionContext.ModelState.IsValid)
            {
                actionContext.ModelState.ToList().ForEach(argument =>
                {
                    if (argument.Value?.ValidationState == ModelValidationState.Invalid)
                    {
                        argument.Value.Errors.ToList().ForEach(error =>
                        {
                            errorMessages["errors"].Add(error.ErrorMessage);
                        });
                    }
                });

                actionContext.Result = new BadRequestObjectResult(errorMessages);
            }
        }
    }
}
