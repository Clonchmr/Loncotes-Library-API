using LoncotesLibrary.Models;
using LoncotesLibrary.Models.DTOs;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// allows passing datetimes without time zone data 
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// allows our api endpoints to access the database through Entity Framework Core
builder.Services.AddNpgsql<LoncotesLibraryDbContext>(builder.Configuration["LoncotesLibraryDbConnectionString"]);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//makes swagger work
app.MapGet("/", () => { return Results.Redirect("/swagger"); });

//------------->Materials<-----------------

app.MapGet("/api/materials", (LoncotesLibraryDbContext db, int? GenreId, int? MaterialTypeId) =>
{
    var query = db.Materials
    .Include(m => m.Genre)
    .Include(m => m.MaterialType)
    .Where(m => m.OutOfCirculationSince == null)
    .Where(m => m.Checkout.All(co => co.ReturnDate != null));

    if (GenreId.HasValue)
    {
       query = query.Where(m => m.GenreId == GenreId.Value);
    }

    if (MaterialTypeId.HasValue)
    {
        query = query.Where(m => m.MaterialTypeId == MaterialTypeId.Value);
    }

    return query
    .Select(m => new MaterialDTO
    {
        Id = m.Id,
        MaterialName = m.MaterialName,
        MaterialTypeId = m.MaterialTypeId,
        MaterialType = new MaterialTypeDTO
        {
            Id = m.MaterialType.Id,
            Name = m.MaterialType.Name,
            CheckoutDays = m.MaterialType.CheckoutDays
        },
        GenreId = m.GenreId,
        Genre = new GenreDTO
        {
            Id = m.Genre.Id,
            Name = m.Genre.Name
        }
    });
});

app.MapGet("/api/materials/{id}", (LoncotesLibraryDbContext db, int id) =>
{
    return db.Materials
    .Include(m => m.Genre)
    .Include(m => m.MaterialType)
    .Include(m => m.Checkout)
    .ThenInclude(c => c.Patron)
    .Select(m => new MaterialDTO
    {
        Id = m.Id,
        MaterialName = m.MaterialName,
        MaterialTypeId = m.MaterialTypeId,
        MaterialType = new MaterialTypeDTO
        {
            Id = m.MaterialType.Id,
            Name = m.MaterialType.Name,
            CheckoutDays = m.MaterialType.CheckoutDays
        },
        GenreId = m.GenreId,
        Genre = new GenreDTO
        {
            Id = m.Genre.Id,
            Name = m.Genre.Name
        },
        Checkout = m.Checkout.Select(c => new CheckoutDTO
        {
            Id = c.Id,
            MaterialId = c.MaterialId,
            PatronId = c.PatronId,
            Patron = new PatronDTO
            {
                Id = c.Patron.Id,
                FirstName = c.Patron.FirstName,
                LastName = c.Patron.LastName,
                Address = c.Patron.Address,
                Email = c.Patron.Email,
                IsActive = c.Patron.IsActive
            },
            CheckoutDate = c.CheckoutDate,
            ReturnDate = c.ReturnDate
        }).ToList()
    })
    .SingleOrDefault(m => m.Id == id) is MaterialDTO material ?
    Results.Ok(material) :
    Results.NotFound();
});

app.MapPost("/api/materials", (LoncotesLibraryDbContext db, Material material) =>
{
    db.Materials.Add(material);
    db.SaveChanges();
    return Results.Created($"/api/materials/{material.Id}", material);
});

app.MapPost("/api/materials/{id}/remove", (LoncotesLibraryDbContext db, int id) =>
{
    Material materialToRemove = db.Materials.SingleOrDefault(m => m.Id == id);

    if (materialToRemove == null)
    {
        return Results.NotFound();
    }

    materialToRemove.OutOfCirculationSince = DateTime.Now;
    db.SaveChanges();
    return Results.NoContent();
});

// ------------>MaterialTypes<-------------

app.MapGet("/api/materialtypes", (LoncotesLibraryDbContext db) =>
{
    return db.MaterialTypes
    .Select(mt => new MaterialTypeDTO
    {
        Id = mt.Id,
        Name = mt.Name,
        CheckoutDays = mt.CheckoutDays
    });
});

//------------>Genres<-----------------

app.MapGet("/api/genres", (LoncotesLibraryDbContext db) =>
{
    return db.Genres
    .Select(g => new GenreDTO
    {
        Id = g.Id,
        Name = g.Name
    });
});

//------------>Patrons<--------------

app.MapGet("/api/patrons", (LoncotesLibraryDbContext db) =>
{
    return db.Patrons
    .Select(p => new PatronDTO
    {
        Id = p.Id,
        FirstName = p.FirstName,
        LastName = p.LastName,
        Address = p.Address,
        Email = p.Email,
        IsActive = p.IsActive
    });
});

app.MapGet("/api/patrons/{id}", (LoncotesLibraryDbContext db, int id) => 
{
    return db.Patrons
    .Include(p => p.Checkout)
    .ThenInclude(c => c.Material)
    .ThenInclude(m => m.MaterialType)
    .Select(p => new PatronWithBalanceDTO
    {
        Id = p.Id,
        FirstName = p.FirstName,
        LastName = p.LastName,
        Address = p.Address,
        Email = p.Email,
        IsActive = p.IsActive,
        Checkout = p.Checkout.Select(pc => new CheckoutWithLateFeeDTO
        {
            Id = pc.Id,
            MaterialId = pc.MaterialId,
            Material = new MaterialDTO
            {
                Id = pc.Material.Id,
                MaterialName = pc.Material.MaterialName,
                MaterialTypeId = pc.Material.MaterialTypeId,
                MaterialType = new MaterialTypeDTO
                {
                    Id = pc.Material.MaterialType.Id,
                    Name = pc.Material.MaterialType.Name,
                    CheckoutDays = pc.Material.MaterialType.CheckoutDays
                },
                GenreId = pc.Material.GenreId,
                
            },
            PatronId = id,
            CheckoutDate = pc.CheckoutDate,
            ReturnDate = pc.ReturnDate
        }).ToList()
        
    })
    .SingleOrDefault(p => p.Id == id) is PatronWithBalanceDTO patron ?
    Results.Ok(patron) :
    Results.NotFound();
});

app.MapPut("/api/patrons/{id}", (LoncotesLibraryDbContext db, int id, Patron patron) =>
{
    Patron patronToUpdate = db.Patrons.SingleOrDefault(p => p.Id == id);

    if (patronToUpdate == null)
    {
        return Results.NotFound();
    }

    patronToUpdate.Address = patron.Address;
    patronToUpdate.Email = patron.Email;

    db.SaveChanges();
    return Results.NoContent();
});

app.MapPost("/api/patrons/{id}/deactivate", (LoncotesLibraryDbContext db, int id) =>
{
    Patron patronToDeactivate = db.Patrons.SingleOrDefault(p => p.Id == id);

    if(patronToDeactivate == null)
    {
        return Results.NotFound();
    }

    patronToDeactivate.IsActive = false;

    db.SaveChanges();
    return Results.NoContent();
});

app.MapPost("/api/patrons/{id}/activate", (LoncotesLibraryDbContext db, int id) =>
{
    Patron patronToActivate = db.Patrons.SingleOrDefault(p => p.Id == id);

    if(patronToActivate == null)
    {
        return Results.NotFound();
    }

    patronToActivate.IsActive = true;

    db.SaveChanges();
    return Results.NoContent();
});

//------------>Checkouts<------------
app.MapPost("/api/checkouts", (LoncotesLibraryDbContext db, Checkout checkout) =>
{
    checkout.CheckoutDate = DateTime.Today;
    db.Checkouts.Add(checkout);
    db.SaveChanges();
    return Results.Created($"/api/checkouts/{checkout.Id}", checkout);
});

app.MapPost("/api/checkouts/{id}/return", (LoncotesLibraryDbContext db, int id) =>
{
    Checkout checkoutToReturn = db.Checkouts.SingleOrDefault(c => c.Id == id);

    if(checkoutToReturn == null)
    {
        return Results.NotFound();
    }

    checkoutToReturn.ReturnDate = DateTime.Today;
    db.SaveChanges();
    return Results.NoContent();
});

app.MapGet("/api/checkouts/overdue", (LoncotesLibraryDbContext db) =>
{
    return db.Checkouts
    .Include(p => p.Patron)
    .Include(co => co.Material)
    .ThenInclude(m => m.MaterialType)
    .Where(co =>
    (DateTime.Today - co.CheckoutDate).Days >
    co.Material.MaterialType.CheckoutDays &&
    co.ReturnDate == null)
    .Select(co => new CheckoutWithLateFeeDTO
    {
        Id = co.Id,
        MaterialId = co.MaterialId,
        Material = new MaterialDTO
        {
            Id = co.Material.Id,
            MaterialName = co.Material.MaterialName,
            MaterialTypeId = co.Material.MaterialTypeId,
            MaterialType = new MaterialTypeDTO
            {
                Id = co.Material.MaterialTypeId,
                Name = co.Material.MaterialType.Name,
                CheckoutDays = co.Material.MaterialType.CheckoutDays
            },
            GenreId = co.Material.GenreId,
            OutOfCirculationSince = co.Material.OutOfCirculationSince
        },
        PatronId = co.PatronId,
        Patron = new PatronDTO
        {
            Id = co.Patron.Id,
            FirstName = co.Patron.FirstName,
            LastName = co.Patron.LastName,
            Address = co.Patron.Address,
            Email = co.Patron.Email,
            IsActive = co.Patron.IsActive
        },
        CheckoutDate = co.CheckoutDate,
        ReturnDate = co.ReturnDate
    })
    .ToList();
});

app.MapGet("/api/checkouts", (LoncotesLibraryDbContext db) =>
{
    return db.Checkouts
    .Include(c => c.Patron)
    .Include(c => c.Material)
    .ThenInclude(m => m.MaterialType)
    .Include(c => c.Material)
    .ThenInclude(c => c.Genre)
    .Select(c => new CheckoutDTO
    {
        Id = c.Id,
        MaterialId = c.MaterialId,
        Material = new MaterialDTO
        {
            Id = c.Material.Id,
            MaterialName = c.Material.MaterialName,
            MaterialTypeId = c.Material.MaterialTypeId,
            MaterialType = new MaterialTypeDTO
            {
                Id = c.Material.MaterialType.Id,
                Name = c.Material.MaterialType.Name,
                CheckoutDays = c.Material.MaterialType.CheckoutDays
            },
            GenreId = c.Material.GenreId,
            Genre = new GenreDTO
            {
                Id = c.Material.Genre.Id,
                Name = c.Material.Genre.Name
            } 
        },
        PatronId = c.PatronId,
        Patron = new PatronDTO
        {
            FirstName = c.Patron.FirstName,
            LastName = c.Patron.LastName,
            Address = c.Patron.Address,
            Email = c.Patron.Email,
            IsActive = c.Patron.IsActive
        },
        CheckoutDate = c.CheckoutDate,
        ReturnDate = c.ReturnDate
    });
});

app.Run();
