from app.models import Produccion
from django.db.models.functions import Cast, Substr
from django.db.models import IntegerField, Min, Max, Avg

# Función para calcular el grado de pertenencia sin redondear
def calcular_pertenencia_baja(valor, TL):
    if TL[2] == TL[3]:
        return 0 
    elif valor >= TL[0] and valor <= TL[2]:
        return 1  # Totalmente bajo
    elif TL[2] < valor < TL[3]:
        return (TL[3] - valor) / (TL[3] - TL[2])  # Decreciente
    else:
        return 0  # No pertenece

def calcular_pertenencia_media(valor, TL):
    if TL[0] == valor and valor == TL[1]:
        return 1 
    elif TL[0] <= valor <= TL[1]:
        return (valor - TL[0]) / (TL[1] - TL[0])  # Creciente
    elif TL[1] < valor < TL[2]:
        return 1  # Totalmente medio
    elif TL[2] <= valor <= TL[3]:
        return (TL[3] - valor) / (TL[3] - TL[2])  # Decreciente
    else:
        return 0  # No pertenece

def calcular_pertenencia_alta(valor, TL):
    if TL[0] == TL[1]:
        return 0
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

def obtenerPercepcionComputacionalSegundoGrado(percepcionesComputacionalesPrimerGrado):
    malo = (0.0, 0.0, 0.2, 0.4)
    normal = (0.2, 0.4, 0.6, 0.9)
    excelente = (0.6, 0.9, 1.0, 1.0)
    regular = (0.0, 0.25, 0.5, 0.5)
    averages = []

    for percepcion in percepcionesComputacionalesPrimerGrado:
        L = percepcion['pertenencia_baja']
        M = percepcion['pertenencia_media']
        H = percepcion['pertenencia_alta']
        AVERAGE = (M + (2 * H)) / 2
        percepcion['average'] = AVERAGE
        averages.append(float(AVERAGE))

    percepcionesComputacionalesSegundoGrado = percepcionesComputacionalesPrimerGrado

    MEDIA = sum(averages) / len(averages)
    VARIANZA = sum([((A - MEDIA) ** 2) for A in averages]) / len(averages)
    DESVIACION = VARIANZA ** 0.5

    if DESVIACION < 0.3:
        GradoRegular = 0
    else:
        GradoRegular = calcular_pertenencia_alta(DESVIACION, regular)

    gradoMalo = calcular_pertenencia_baja(MEDIA, malo)
    gradoNormal = calcular_pertenencia_media(MEDIA, normal)
    gradoExcelente = calcular_pertenencia_alta(MEDIA, excelente)
    percepcionesComputacionalesSegundoGrado.append({'value_mean': MEDIA, 'variance': VARIANZA, 'standard_deviation': DESVIACION, 'pertenencia_mala': gradoMalo, 'pertenencia_normal': gradoNormal, 'pertenencia_excelente': gradoExcelente, 'pertenencia_regular': GradoRegular})

    return percepcionesComputacionalesSegundoGrado


