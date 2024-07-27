using Azure;
using back_end.Data;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace back_end.Controllers
{
    [ApiController]
    [Route("customer/[controller]")]
    public class DialogflowController : Controller
    {
        private readonly DialogService _service;
        private readonly ILogger<DialogflowController> _logger;

        public DialogflowController(DialogService service, ILogger<DialogflowController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> DialogAction(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Running webhook...");
            string resposneJson = await _service.ProcessDialogActionAsync(Request.Body, cancellationToken);
            return Content(resposneJson, "application/json");
        }
    }
}
