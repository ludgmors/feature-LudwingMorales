using Microsoft.AspNetCore.Mvc;
using ApiAlumnos.Data;
using ApiAlumnos.Models;
using ApiAlumnos.Filters;
using Microsoft.EntityFrameworkCore;

namespace ApiAlumnos.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    [ApiKeyAuth]
    public class AlumnosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AlumnosController(AppDbContext context)
        {
            _context = context;
        }

        // Crear alumno
        [HttpPost]
        public async Task<IActionResult> CrearAlumno(Alumno alumno)
        {
            _context.Alumnos.Add(alumno);
            await _context.SaveChangesAsync();
            return Ok(alumno);
        }

          //  Obtener todos los alumnos
        [HttpGet]
        public async Task<IActionResult> ObtenerTodos()
        {
            var alumnos = await _context.Alumnos.ToListAsync();
            return Ok(alumnos);
        }
        

        // Obtener alumnos por grado
        [ApiKeyAuth] 
        [HttpGet("grado/{grado}")]
        public async Task<IActionResult> ObtenerPorGrado(string grado)
        {
            if (string.IsNullOrWhiteSpace(grado))
                return BadRequest("El grado no puede estar vacío.");

            var alumnos = await _context.Alumnos
                                        .Where(a => a.Grado != null && a.Grado.ToLower() == grado.ToLower())
                                        .ToListAsync();

            // Siempre 200, aunque esté vacío
            return Ok(alumnos);
        }


        
        //  Actualizar alumno
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarAlumno(int id, Alumno alumnoActualizado)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno == null)
                return NotFound();

            alumno.Nombre = alumnoActualizado.Nombre;
            alumno.FechaNacimiento = alumnoActualizado.FechaNacimiento;
            alumno.NombrePadre = alumnoActualizado.NombrePadre;
            alumno.NombreMadre = alumnoActualizado.NombreMadre;
            alumno.Grado = alumnoActualizado.Grado;
            alumno.Seccion = alumnoActualizado.Seccion;
            alumno.FechaIngreso = alumnoActualizado.FechaIngreso;

            await _context.SaveChangesAsync();
            return Ok(alumno);
        }

        //  Eliminar alumno
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarAlumno(int id)
        {
            var alumno = await _context.Alumnos.FindAsync(id);
            if (alumno == null)
                return NotFound();

            _context.Alumnos.Remove(alumno);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

