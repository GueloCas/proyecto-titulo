from .models import Inversor, Produccion
from .serializer import InversorSerializer, ProduccionSerializer
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import IntegerField, Min, Max, Avg
from django.db.models.functions import Cast, Substr
import pandas as pd

from app.utils.functions import calcular_pertenencia_baja, calcular_pertenencia_media, calcular_pertenencia_alta, obtenerTerminosLinguisticos, obtenerEstadisticasProduccionesPorHora

class InversorViewSet(viewsets.ModelViewSet):
    queryset = Inversor.objects.all()
    serializer_class = InversorSerializer

class ProduccionViewSet(viewsets.ModelViewSet):
    queryset = Produccion.objects.all()
    serializer_class = ProduccionSerializer

class ExcelUploadView(APIView):
    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        
        if not file:
            return Response({"error": "No se envió ningún archivo"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Lee el archivo Excel usando pandas
            df = pd.read_excel(file, header=None)
            
            # Recorre las columnas de la hoja de Excel
            for col_index in range(1, len(df.columns)):
                # Obtener el nombre del inversor (primera casilla de la columna)
                nombre_inversor = df.iloc[0, col_index]  # Primer valor de la columna
                print(f"Nombre del Inversor en Columna {col_index + 1}: {nombre_inversor}")

                inversor = Inversor.objects.create(nombre=nombre_inversor)
                print(f"Inversor creado con ID: {inversor.id}")
                
                # Iterar hacia abajo en la columna, comenzando desde la fila 1
                """for row_index in range(1, len(df)):
                    valor = df.iloc[row_index, col_index]  # Obtener el valor en la fila actual

                    if pd.notna(valor): # Si el valor no es nulo
                        periodo = df.iloc[row_index, 0] # Obtener el periodo de tiempo
                        fecha, hora = periodo.split(', ') # Separar la fecha y la hora
                        print(f"Fila {row_index}, inversor: {nombre_inversor}, fecha: {fecha}, hora: {hora}, valor: {valor}")

                        Produccion.objects.create( # Crear un objeto Produccion
                            Dia=fecha,
                            Hora=hora,
                            cantidad=valor,
                            inversor=inversor
                        )
"""
            return Response({"message": "Archivo procesado correctamente"}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class InversorProduccionView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ID del inversor de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor_id')
        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtener el inversor por ID
            inversor = Inversor.objects.get(pk=inversor_id)

            # Agrupar las producciones por hora y calcular estadísticas agregadas
            estadisticas_por_hora = obtenerEstadisticasProduccionesPorHora(inversor)

            # Serializar producciones completas
            producciones = Produccion.objects.filter(inversor=inversor).annotate(
                hora_num=Cast(Substr('Hora', 2), IntegerField())  # Extraer número de la hora para poder ordenar
            ).order_by('hora_num')
            serializer = ProduccionSerializer(producciones, many=True)

            # Crear respuesta
            response_data = {
                'nombre_inversor': inversor.nombre,  # Nombre del inversor
                'producciones': serializer.data,  # Producciones completas
                'estadisticas_por_hora': list(estadisticas_por_hora)  # Estadísticas agrupadas por hora
            }

            return Response(response_data, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class InversorProduccionEstadisticasView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ID del inversor de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor_id')
        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtener el inversor por ID
            inversor = Inversor.objects.get(pk=inversor_id)

            # Agrupar las producciones por hora y calcular estadísticas agregadas
            estadisticas_por_hora = obtenerEstadisticasProduccionesPorHora(inversor)

            # Serializar producciones completas
            producciones = Produccion.objects.filter(inversor=inversor).order_by('Dia')
            serializer = ProduccionSerializer(producciones, many=True)

            # Crear respuesta
            response_data = {
                'nombre_inversor': inversor.nombre,  # Nombre del inversor
                'producciones': serializer.data,  # Producciones completas
                'estadisticas_por_hora': list(estadisticas_por_hora)  # Estadísticas agrupadas por hora
            }

            return Response(response_data, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class InversorProduccionHoraView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ID del inversor y la hora de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor_id')
        hora = request.query_params.get('hora')
        print(f"inversor_id: {inversor_id}, hora: {hora}")

        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            inversor = Inversor.objects.get(pk=inversor_id)
            producciones = Produccion.objects.filter(inversor=inversor, Hora=hora)
            serializer = ProduccionSerializer(producciones, many=True)

            response_data = {
                'nombre_inversor': inversor.nombre, 
                'producciones': serializer.data,
                'minimo': producciones.aggregate(minimo=Min('cantidad'))['minimo'], # Obtener el valor mínimo
                'maximo': producciones.aggregate(maximo=Max('cantidad'))['maximo'], # Obtener el valor máximo
                'promedio': producciones.aggregate(promedio=Avg('cantidad'))['promedio'], # Obtener el promedio
            }
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class InversorMinMaxHoraView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ID del inversor y la hora de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor_id')
        hora = request.query_params.get('hora')
        print(f"inversor_id: {inversor_id}, hora: {hora}")

        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            inversor = Inversor.objects.get(pk=inversor_id)
            producciones = Produccion.objects.filter(inversor=inversor, Hora=hora)
            serializer = ProduccionSerializer(producciones, many=True)

            response_data = {
                'nombre_inversor': inversor.nombre, 
                'minimo': producciones.aggregate(minimo=Min('cantidad'))['minimo'], # Obtener el valor mínimo
                'maximo': producciones.aggregate(maximo=Max('cantidad'))['maximo'], # Obtener el valor máximo
            }
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VariableLinguisticaHoraView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el valor, min y max de los parámetros de la solicitud
        valor = request.query_params.get('valor')
        min_value = request.query_params.get('min')
        max_value = request.query_params.get('max')
        print(f"valor: {valor}, min: {min_value}, max: {max_value}")

        if valor is None or min_value is None or max_value is None:
            return Response({"error": "Se requiere el parámetro 'valor', 'min' y 'max'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Convertir los valores de valor, min y max a flotantes
            valor = float(valor)
            min_value = float(min_value)
            max_value = float(max_value)

            TLbaja, TLmedia, TLalta = obtenerTerminosLinguisticos(min_value, max_value)

            # Calcular el grado de pertenencia del valor
            pertenencia_baja = calcular_pertenencia_baja(valor, TLbaja)
            pertenencia_media = calcular_pertenencia_media(valor, TLmedia)
            pertenencia_alta = calcular_pertenencia_alta(valor, TLalta)

            # Preparar la respuesta
            response_data = {
                'TLbaja': TLbaja,
                'TLmedia': TLmedia,
                'TLalta': TLalta,
                'pertenencia': {
                    'baja': round(pertenencia_baja, 2),
                    'media': round(pertenencia_media, 2),
                    'alta': round(pertenencia_alta, 2)
                }
            }
            return Response(response_data, status=status.HTTP_200_OK)
        
        except ValueError:
            return Response({"error": "Los parámetros 'valor', 'min' y 'max' deben ser numéricos"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class InversorProduccionGradoPertenenciaView(APIView): 
    def get(self, request, *args, **kwargs):
        # Obtener el ID del inversor de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor_id')

        print(f"inversor_id: {inversor_id}")
        
        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtener el inversor
            inversor = Inversor.objects.get(pk=inversor_id)
            
            # Obtener las estadísticas por hora del inversor
            estadisticas_por_hora = obtenerEstadisticasProduccionesPorHora(inversor)
            
            # Obtener las producciones del inversor
            producciones = Produccion.objects.filter(inversor=inversor)
            
            TLlist = []

            # Iterar sobre cada producción
            for produccion in producciones:
                # Extraer el número de la hora (remover el prefijo "H")
                hora_num = int(produccion.Hora.replace('H', ''))
                
                # Buscar las estadísticas correspondientes para esa hora
                estadisticas_hora = next(
                    (e for e in estadisticas_por_hora if e['hora_num'] == hora_num), 
                    None
                )
                
                # Verificar si se encontraron estadísticas para la hora actual
                if estadisticas_hora:
                    # Obtener los términos lingüísticos basados en los valores mínimos y máximos de esa hora
                    TLbaja, TLmedia, TLalta = obtenerTerminosLinguisticos(
                        estadisticas_hora['cantidad_minima'], 
                        estadisticas_hora['cantidad_maxima']
                    )
                    
                    # Calcular los grados de pertenencia
                    pertenencia_baja = calcular_pertenencia_baja(produccion.cantidad, TLbaja)
                    pertenencia_media = calcular_pertenencia_media(produccion.cantidad, TLmedia)
                    pertenencia_alta = calcular_pertenencia_alta(produccion.cantidad, TLalta)
                    

                    # Agregar los datos al listado final
                    TLlist.append({
                        'Dia': produccion.Dia,
                        'Hora': produccion.Hora,
                        'cantidad': produccion.cantidad,
                        'pertenencia': {
                            'baja': round(pertenencia_baja, 2),
                            'media': round(pertenencia_media, 2),
                            'alta': round(pertenencia_alta, 2)
                        }
                    })
                else:
                    print(f"No se encontraron estadísticas para la hora: {produccion.Hora}")
            
            return Response(TLlist, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


"""         TLbaja = [round(min_value, 5), round(min_value, 5), round(min_value+L8, 5), round(min_value+(L8*3), 5)]
            TLmedia = [round(MEDIA-(L8*3), 5), round(MEDIA-L8, 5), round(MEDIA+L8, 5), round(MEDIA+(L8*3), 5)]
            TLalta = [round(max_value-(L8*3), 5), round(max_value-L8, 5), round(max_value, 5), round(max_value, 5)]

    TLbaja = [round(min_value, 1), round(min_value, 1), round(min_value+L8, 1), round(min_value+(L8*3), 1)]
    TLmedia = [round(MEDIA-(L8*3), 1), round(MEDIA-L8, 1), round(MEDIA+L8, 1), round(MEDIA+(L8*3), 1)]
    TLalta = [round(max_value-(L8*3), 1), round(max_value-L8, 1), round(max_value, 1), round(max_value, 1)]  
    
    TLbaja = [min_value, min_value,min_value+L8,min_value+(L8*3)]
    TLmedia = [MEDIA-(L8*3), MEDIA-L8, MEDIA+L8, MEDIA+(L8*3)]
    TLalta = [max_value-(L8*3), max_value-L8, max_value, max_value]"""