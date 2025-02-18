using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ProgressBar_SignalR.Hubs;

namespace ProgressBar_SignalR.Controllers
{
    [Route("api/[controller]")]
    public class ImportExcel : Controller
    {
        [HttpPost("importExcel")]
        public async Task<IActionResult> importExcel(IFormFile file, [FromServices] IHubContext<ProgressHub> hubContext)
        {
            try
            {
                if (file == null)
                {
                    return BadRequest("Please select an excel file.");
                }

                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    stream.Position = 0;

                    //var personList = new List<tbariciboya>
                    using (var workbook = new XLWorkbook(stream))
                    {
                        var worksheet = workbook.Worksheets.First();
                        var rows = worksheet.RowsUsed();
                        int totalRows = rows.Count();
                        int currentRow = 0;

                        foreach (var row in rows) //skip header row
                        {
                            currentRow++;
                            //send progress update via SignalR
                            int progressValue = (int)((currentRow / (float)totalRows) * 100);
                            await hubContext.Clients.All.SendAsync("ReceiveProgress", progressValue);
                        }
                    }
                }

                return Ok(new { message = "File uploaded succesfully!", data = "" });
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            
        }
    }
}
