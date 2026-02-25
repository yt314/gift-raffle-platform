namespace ex1.Interfaces.Services
{
    public interface IEmailService
    {
        Task SendWinnerEmail(string toEmail, string userName, string prizeName);
    }
}