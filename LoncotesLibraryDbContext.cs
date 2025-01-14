using LoncotesLibrary.Models;
using Microsoft.EntityFrameworkCore;

public class LoncotesLibraryDbContext : DbContext
{
    public DbSet<Checkout> Checkouts { get; set; }
    public DbSet<Genre> Genres { get; set; }
    public DbSet<Material> Materials { get; set; }
    public DbSet<MaterialType> MaterialTypes { get; set; }
    public DbSet<Patron> Patrons { get; set; }

    public LoncotesLibraryDbContext(DbContextOptions<LoncotesLibraryDbContext> context) : base(context)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MaterialType>().HasData(new MaterialType[]
        {
            new MaterialType {Id = 1, Name = "Book", CheckoutDays = 7},
            new MaterialType {Id = 2, Name = "CD", CheckoutDays = 4},
            new MaterialType {Id = 3, Name = "Periodical", CheckoutDays = 5}
        });
        modelBuilder.Entity<Patron>().HasData(new Patron[]
        {
            new Patron {Id = 1, FirstName = "John", LastName = "Krasinski", Address = "123 Scranton Way", Email = "JohnK@email.com", IsActive = true},
            new Patron {Id = 2, FirstName = "Mark", LastName = "Denmark", Address = "101 Denmark Dn.", Email = "Denmark.Gov", IsActive = true}
        });
        modelBuilder.Entity<Genre>().HasData(new Genre[]
        {
            new Genre {Id = 1, Name = "Sci-Fi"},
            new Genre {Id = 2, Name = "Fantasy"},
            new Genre {Id = 3, Name = "History"},
            new Genre {Id = 4, Name = "Politics"},
            new Genre {Id = 5, Name = "True Crime"}
        });
        modelBuilder.Entity<Material>().HasData(new Material[]
        {
            new Material {Id = 1, MaterialName = "In Ascension", MaterialTypeId = 1, GenreId = 1, OutOfCirculationSince = null},
            new Material {Id = 2, MaterialName = "Children of Time", MaterialTypeId = 2, GenreId = 1, OutOfCirculationSince = null},
            new Material {Id = 3, MaterialName = "A Court of silver Flames", MaterialTypeId = 1, GenreId = 2, OutOfCirculationSince = new DateTime(2020, 1, 15)},
            new Material {Id = 4, MaterialName = "The Golem and the Jinni", MaterialTypeId = 3, GenreId = 2, OutOfCirculationSince = new DateTime(2014, 2, 2)},
            new Material {Id = 5, MaterialName = "The Small and Mighty", MaterialTypeId = 1, GenreId = 3, OutOfCirculationSince = null},
            new Material {Id = 6, MaterialName = "How to Hide an Empire", MaterialTypeId = 2, GenreId = 3, OutOfCirculationSince = null},
            new Material {Id = 7, MaterialName = "Youth to Power", MaterialTypeId = 2, GenreId = 4, OutOfCirculationSince = new DateTime(2023, 5, 9)},
            new Material {Id = 8, MaterialName = "Real Crime Detective", MaterialTypeId = 3, GenreId = 5, OutOfCirculationSince = new DateTime(2020, 12, 1)},
            new Material {Id = 9, MaterialName = "I'll be Gone in the Dark", MaterialTypeId = 2, GenreId = 5, OutOfCirculationSince = null},
            new Material {Id = 10, MaterialName = "The Splendid and the Vile", MaterialTypeId = 1, GenreId = 1, OutOfCirculationSince = null}
        });
    }
}