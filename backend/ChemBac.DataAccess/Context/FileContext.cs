using ChemBac.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChemBac.DataAccess.Context;

public class FileContext : DbContext
{
    public DbSet<UploadedFile> UploadedFiles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }
}
