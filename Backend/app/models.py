from django.db import models

# Create your models here.

class Inversor(models.Model):
    nombre = models.CharField(max_length=200)

    def __str__(self):
        return self.nombre

class Produccion(models.Model):
    Dia = models.CharField(max_length=50) # Puede ser DateField
    Hora = models.CharField(max_length=50) # Puede ser TimeField
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    inversor = models.ForeignKey(Inversor, on_delete=models.CASCADE)

    def __str__(self):
        return str(Inversor) + ' ' + self.Dia + ' ' + self.Hora
