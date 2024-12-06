from django.db import models
from django.db.models import IntegerField, Min, Max, Avg, Sum
from django.db.models.functions import Cast, Substr
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

class Estacion(models.Model):
    nombre = models.CharField(max_length=200)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre
class Inversor(models.Model):
    nombre = models.CharField(max_length=200)
    estacion = models.ForeignKey(Estacion, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.nombre

    def obtener_producciones(self):
        return self.produccion_set.all().order_by('fecha')
    
    def obtener_producciones_hora(self, anio, mes, hora):
        return Produccion.objects.filter(inversor=self, anio=anio, mes=mes, hora=hora).order_by('dia')
    
    def obtener_producciones_dia(self, dia):
        return Produccion.objects.filter(inversor=self, Dia=dia).order_by('Hora')
    
    def obtener_cantidad_total_hora(self, hora):
        total = Produccion.objects.filter(inversor=self, Hora=hora).aggregate(total=Sum('cantidad'))
        return total['total'] if total['total'] is not None else 0
    
    def obtener_cantidad_total_diaria(self, anio, mes, dia):
        total = Produccion.objects.filter(inversor=self, anio=anio, mes=mes, dia=dia).aggregate(total=Sum('cantidad'))
        return total['total'] if total['total'] is not None else 0
    
    def obtener_producciones_ordenHora(self, anio, mes):
        return Produccion.objects.filter(inversor=self, anio=anio, mes=mes).annotate(
            hora_num=Cast(Substr('hora', 2), IntegerField())  # Extraer número de la hora para poder ordenar
        ).order_by('hora_num')
    
    def obtener_MinMaxProm_producciones(self, anio, mes):
        return Produccion.objects.filter(inversor=self, anio=anio, mes=mes).annotate(
            hora_num=Cast(Substr('hora', 2), IntegerField())  # Extraer número de la hora
        ).values('hora_num').annotate(
            cantidad_minima=Min('cantidad'),
            cantidad_maxima=Max('cantidad'),
            cantidad_promedio=Avg('cantidad')
        ).order_by('hora_num')
    
    def obtener_MinMaxProm_producciones_hora(self, anio, mes, hora):
        return Produccion.objects.filter(inversor=self, anio=anio, mes=mes, hora=hora).annotate(
            hora_num=Cast(Substr('hora', 2), IntegerField())  # Extraer número de la hora
        ).values('hora_num').annotate(
            cantidad_minima=Min('cantidad'),
            cantidad_maxima=Max('cantidad'),
            cantidad_promedio=Avg('cantidad')
        ).order_by('hora_num')
    
    def obtener_MinMaxProm_producciones_dia(self, anio, mes, dia):
        return Produccion.objects.filter(inversor=self, anio=anio, mes=mes, dia=dia).values('hora').annotate(
            cantidad_minima=Min('cantidad'),
            cantidad_maxima=Max('cantidad'),
            cantidad_promedio=Avg('cantidad')
        ).order_by('hora')

class Produccion(models.Model):
    fecha = models.CharField(max_length=50)  # Puede ser DateField
    anio = models.IntegerField(
        validators=[MinValueValidator(1900), MaxValueValidator(2100)],  # Rango permitido para año
        default=2024  # Valor por defecto para anio
    )
    mes = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(12)],  # Rango permitido para mes
        default=1  # Valor por defecto para mes (enero)
    )
    dia = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(31)],  # Rango permitido para día
        default=1  # Valor por defecto para día (primer día del mes)
    )
    hora = models.CharField(max_length=50)  # Puede ser TimeField
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    inversor = models.ForeignKey(Inversor, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.inversor} {self.fecha} {self.anio} {self.mes} {self.dia} {self.hora} {self.cantidad}'
