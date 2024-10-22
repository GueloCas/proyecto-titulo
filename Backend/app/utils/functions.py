from app.models import Produccion
from django.db.models.functions import Cast, Substr
from django.db.models import IntegerField, Min, Max, Avg

# Función para calcular el grado de pertenencia sin redondear
def calcular_pertenencia_baja(valor, TL):
    if valor == 0 and TL[2] == 0:
        return -1 
    elif valor >= TL[0] and valor <= TL[2]:
        return 1  # Totalmente bajo
    elif TL[2] < valor < TL[3]:
        return (TL[3] - valor) / (TL[3] - TL[2])  # Decreciente
    else:
        return 0  # No pertenece

def calcular_pertenencia_media(valor, TL):
    if valor == 0 and TL[2] == 0:
        return -1 
    elif TL[0] <= valor <= TL[1]:
        return (valor - TL[0]) / (TL[1] - TL[0])  # Creciente
    elif TL[1] < valor < TL[2]:
        return 1  # Totalmente medio
    elif TL[2] <= valor <= TL[3]:
        return (TL[3] - valor) / (TL[3] - TL[2])  # Decreciente
    else:
        return 0  # No pertenece

def calcular_pertenencia_alta(valor, TL):
    if valor == 0 and TL[2] == 0:
        return -1 
    elif valor <= TL[0]:
        return 0  # No pertenece
    elif TL[0] < valor <= TL[1]:
        return (valor - TL[0]) / (TL[1] - TL[0])  # Creciente
    else:
        return 1  # Totalmente alto
    
def obtenerTerminosLinguisticos(min_value, max_value):

    # Calcular L8 y MEDIA
    L8 = (max_value - min_value) / 8
    MEDIA = (min_value + max_value) / 2

    # Crear los conjuntos TLbaja, TLmedia, TLalta sin redondear
    TLbaja = [round(min_value, 5), round(min_value, 5), round(min_value+L8, 5), round(min_value+(L8*3), 5)]
    TLmedia = [round(MEDIA-(L8*3), 5), round(MEDIA-L8, 5), round(MEDIA+L8, 5), round(MEDIA+(L8*3), 5)]
    TLalta = [round(max_value-(L8*3), 5), round(max_value-L8, 5), round(max_value, 5), round(max_value, 5)]
    
    return TLbaja, TLmedia, TLalta

def obtenerEstadisticasProduccionesPorHora(inversor):
    estadisticas_por_hora = Produccion.objects.filter(inversor=inversor).annotate(
        hora_num=Cast(Substr('Hora', 2), IntegerField())  # Extraer número de la hora
    ).values('hora_num').annotate(
        cantidad_minima=Min('cantidad'),
        cantidad_maxima=Max('cantidad'),
        cantidad_promedio=Avg('cantidad')
    ).order_by('hora_num')

    return estadisticas_por_hora