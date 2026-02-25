using Microsoft.EntityFrameworkCore;
using ex1.Models;
using System.Collections.Generic;
using System.Reflection.Emit;


namespace ex1.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options) { }
        public DbSet<User> Users => Set<User>();
        public DbSet<Donor> Donors => Set<Donor>();
        public DbSet<Prize> Prizes => Set<Prize>();
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Category> Categories { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =========================
            // User
            // =========================
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.Property(u => u.FirstName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(u => u.LastName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(u => u.Phone)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(u => u.PasswordHash)
                    .IsRequired();

                entity.Property(u => u.Address)
                    .IsRequired()
                    .HasMaxLength(200);
            });

            // =========================
            // Donor
            // =========================
            modelBuilder.Entity<Donor>(entity =>
            {
                entity.HasKey(d => d.Id);

                entity.Property(d => d.FirstName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(d => d.LastName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(d => d.Email)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(d => d.Phone)
                    .IsRequired()
                    .HasMaxLength(20);
            });

            // =========================
            // Category
            // =========================
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            // =========================
            // Prize
            // =========================
            modelBuilder.Entity<Prize>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(p => p.Description)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(p => p.ImagePath)
                    .IsRequired();

                entity.Property(p => p.TicketPrice)
                    .IsRequired()
                    .HasColumnType("decimal(18,2)");

                entity.Property(p => p.IsRaffleDone)
                    .IsRequired();

                entity.HasOne(p => p.Donor)
                    .WithMany(d => d.Prizes)
                    .HasForeignKey(p => p.DonorId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(p => p.category)
                    .WithMany()
                    .HasForeignKey(p => p.CategoryId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(p => p.Winner)
                    .WithMany()
                    .HasForeignKey(p => p.WinnerUserId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // =========================
            // Cart
            // =========================
            modelBuilder.Entity<Cart>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.HasOne(c => c.User)
                    .WithMany()
                    .HasForeignKey(c => c.UserId)
                    .IsRequired()
                    //.OnDelete(DeleteBehavior.Restrict);
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // =========================
            // CartItem
            // =========================
            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasKey(ci => ci.Id);

                entity.Property(ci => ci.Quantity)
                    .IsRequired();

                entity.HasOne(ci => ci.Cart)
                    .WithMany(c => c.Items)
                    .HasForeignKey(ci => ci.CartId)
                    .IsRequired();

                entity.HasOne(ci => ci.Prize)
                    .WithMany()
                    .HasForeignKey(ci => ci.PrizeId)
                    .IsRequired();
            });

            // =========================
            // Ticket
            // =========================
            modelBuilder.Entity<Ticket>(entity =>
            {
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Quantity)
                    .IsRequired();

                entity.Property(t => t.TotalPrice)
                    .IsRequired()
                    .HasColumnType("decimal(18,2)");

                entity.HasOne(t => t.User)
                    .WithMany(u => u.Tickets)
                    .HasForeignKey(t => t.UserId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Restrict);


                entity.HasOne(t => t.Prize)
                    .WithMany()
                    .HasForeignKey(t => t.PrizeId)
                    .IsRequired();
            });
        }

    }
}