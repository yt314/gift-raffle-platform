namespace ex1.DTOs
{
    public class WinnerDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class LotteryResultDto
    {
        public int PrizeId { get; set; }
        public int? WinnerUserId { get; set; }
        public WinnerDto? Winner { get; set; }
        public bool EmailSent { get; set; }
    }
}
