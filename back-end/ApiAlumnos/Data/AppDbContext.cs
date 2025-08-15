using Microsoft.EntityFrameworkCore;
using ApiAlumnos.Models;

namespace ApiAlumnos.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Alumno> Alumnos { get; set; }
    }
}
