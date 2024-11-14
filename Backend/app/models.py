from django.db import models
from django.db.models import IntegerField, Min, Max, Avg
from django.db.models.functions import Cast, Substr

class Inversor(models.Model):
    nombre = models.CharField(max_length=200)

    def __str__(self):
        return self.nombre

    def obtener_producciones(self):
        return self.produccion_set.all().order_by('Dia')
    
    def obtener_producciones_hora(self, hora):
        return Produccion.objects.filter(inversor=self, Hora=hora).order_by('Dia')
    
    def obtener_producciones_ordenHora(self):
        return Produccion.objects.filter(inversor=self).annotate(
            hora_num=Cast(Substr('Hora', 2), IntegerField())  # Extraer número de la hora para poder ordenar
        ).order_by('hora_num')
    
    def obtener_MinMaxProm_producciones(self):
        return Produccion.objects.filter(inversor=self).annotate(
            hora_num=Cast(Substr('Hora', 2), IntegerField())  # Extraer número de la hora
        ).values('hora_num').annotate(
            cantidad_minima=Min('cantidad'),
            cantidad_maxima=Max('cantidad'),
            cantidad_promedio=Avg('cantidad')
        ).order_by('hora_num')
    
    def obtener_MinMaxProm_producciones_hora(self, hora):
        return Produccion.objects.filter(inversor=self, Hora=hora).annotate(
            hora_num=Cast(Substr('Hora', 2), IntegerField())  # Extraer número de la hora
        ).values('hora_num').annotate(
            cantidad_minima=Min('cantidad'),
            cantidad_maxima=Max('cantidad'),
            cantidad_promedio=Avg('cantidad')
        ).order_by('hora_num')

class Produccion(models.Model):
    Dia = models.CharField(max_length=50)  # Puede ser DateField
    Hora = models.CharField(max_length=50)  # Puede ser TimeField
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    inversor = models.ForeignKey(Inversor, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.inversor} {self.Dia} {self.Hora} {self.cantidad}'
