namespace ApiAlumnos.Models
{
    public class Alumno
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public DateTime FechaNacimiento { get; set; }
        public string NombrePadre { get; set; } = string.Empty;
        public string NombreMadre { get; set; } = string.Empty;
        public string Grado { get; set; } = string.Empty;
        public string Seccion { get; set; } = string.Empty;
        public DateTime FechaIngreso { get; set; }
    }
}
