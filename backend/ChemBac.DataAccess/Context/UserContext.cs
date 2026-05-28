using Microsoft.EntityFrameworkCore;

namespace ChemBac.DataAccess.Context;

public class UserContext : ChemBacDbContext
{
    public UserContext()
    {
    }

    public UserContext(DbContextOptions<UserContext> options) : base(options)
    {
    }
}
