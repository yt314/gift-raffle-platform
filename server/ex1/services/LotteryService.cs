using ex1.DTOs;
using ex1.Interfaces.Repositorys;
using ex1.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace ex1.services
{
    public class LotteryService : ILotteryService
    {
        private readonly ILotteryRepository _lotteryRepository;
        private readonly IEmailService _emailService;
        private readonly ILogger<LotteryService> _logger;

        public LotteryService(
            ILotteryRepository lotteryRepository,
            IEmailService emailService,
            ILogger<LotteryService> logger)
        {
            _lotteryRepository = lotteryRepository;
            _emailService = emailService;
            _logger = logger;
        }

        public async Task<LotteryResultDto> RafflePrizeAsync(int prizeId)
        {
            var entries = await _lotteryRepository.GetRaffleEntries(prizeId);

            if (entries.Count == 0)
                throw new Exception("אין משתתפים להגרלה");

            var prize = await _lotteryRepository.GetPrizeById(prizeId);

            var random = new Random();
            var winner = entries[random.Next(entries.Count)];

            await _lotteryRepository.SetWinner(prizeId, winner.Id);

            bool emailSent = true;
            try
            {
                await _emailService.SendWinnerEmail(
                    winner.Email!,
                    $"{winner.FirstName} {winner.LastName}",
                    prize.Name
                );
            }
            catch (Exception ex)
            {
                emailSent = false;
                _logger.LogError(ex, "שליחת מייל לזוכה נכשלה");
            }

            var result = new LotteryResultDto
            {
                PrizeId = prizeId,
                WinnerUserId = winner.Id,
                EmailSent = emailSent,
                Winner = new WinnerDto
                {
                    Id = winner.Id,
                    FullName = $"{winner.FirstName} {winner.LastName}",
                    Email = winner.Email!
                }
            };

            await AppendLotteryResult(result);

            return result;
        }

        private async Task AppendLotteryResult(LotteryResultDto result)
        {
            try
            {
                Directory.CreateDirectory("Reports");
                var path = "Reports/LotterySummary.csv";
                var exists = File.Exists(path);

                using var writer = new StreamWriter(path, true);
                if (!exists)
                    await writer.WriteLineAsync("PrizeId,WinnerUserId");

                await writer.WriteLineAsync($"{result.PrizeId},{result.WinnerUserId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בכתיבת קובץ סיכום הגרלה");
            }
        }
    }
}
