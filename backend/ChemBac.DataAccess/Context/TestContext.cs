using Microsoft.EntityFrameworkCore;

namespace ChemBac.DataAccess.Context;

public class TestContext : ChemBacDbContext
{
    public TestContext()
    {
    }

    public TestContext(DbContextOptions<TestContext> options) : base(options)
    {
    }
}
