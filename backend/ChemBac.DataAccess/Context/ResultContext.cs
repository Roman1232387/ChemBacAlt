using Microsoft.EntityFrameworkCore;

namespace ChemBac.DataAccess.Context;

public class ResultContext : ChemBacDbContext
{
    public ResultContext()
    {
    }

    public ResultContext(DbContextOptions<ResultContext> options) : base(options)
    {
    }
}
