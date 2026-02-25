using ex1.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace ex1.services
{
        public class EmailService : IEmailService
        {

            private readonly IConfiguration _configuration;
            private readonly ILogger<EmailService> _logger; // LOG

            public EmailService(
                IConfiguration configuration,
                ILogger<EmailService> logger) // LOG
            {
                _configuration = configuration;
                _logger = logger;
            }

            public async Task SendWinnerEmail(string toEmail, string userName, string prizeName)
            {
            try
            {
                _logger.LogInformation(
                    "Attempting to send winner email to {Email} for prize {Prize}",
                    toEmail, prizeName); // LOG

                var fromEmail = _configuration["Email:EmailAddress"]
                ?? throw new InvalidOperationException("Email address is missing in configuration");

                var appPassword = _configuration["Email:AppPassword"];

            var message = new MailMessage
            {
                From = new MailAddress(fromEmail, "מערכת ההגרלות הסינית"),
                Subject = "🎉 מזל טוב! זכית בהגרלה",
                Body =
                    $"<h3>שלום {userName},</h3>" +
                    $"<p>אנו שמחים לבשר לך שזכית בפרס: <b>{prizeName}</b></p>" +
                    $"<p>ניצור איתך קשר בהקדם.</p>" +
                    $"<br/><p>בברכה,<br/>צוות ההגרלה</p>",
                IsBodyHtml = true
            };
                message.To.Add(toEmail); // ✅ נכון

                //await smtpClient.SendMailAsync(message);

                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587, 
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(fromEmail, appPassword),

                };

                await smtpClient.SendMailAsync(message);

                _logger.LogInformation(
                    "Winner email sent successfully to {Email}",
                    toEmail); // LOG
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error occurred while sending email to {Email}",
                    toEmail); // LOG

                throw; // ❗ לא נוגע
            }
        }
    }
}