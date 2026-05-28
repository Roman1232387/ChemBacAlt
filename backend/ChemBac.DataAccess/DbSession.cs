namespace ChemBac.DataAccess;

public class DbSession
{
    public static string? ConnectionString { get; set; }

    public static string GetConnectionString()
    {
        return ConnectionString
            ?? throw new InvalidOperationException("Connection string is not configured.");
    }
}
