from .models import Inversor, Produccion
from .serializer import InversorSerializer, ProduccionSerializer
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import IntegerField, Min, Max, Avg
from django.db.models.functions import Cast, Substr
import pandas as pd

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
                for row_index in range(1, len(df)):
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
            producciones_por_hora = Produccion.objects.filter(inversor=inversor).annotate(
                hora_num=Cast(Substr('Hora', 2), IntegerField())  # Extraer número de la hora
            ).values('hora_num').annotate(
                cantidad_minima=Min('cantidad'),
                cantidad_maxima=Max('cantidad'),
                cantidad_promedio=Avg('cantidad')
            ).order_by('hora_num')

            # Serializar producciones completas
            producciones = Produccion.objects.filter(inversor=inversor).annotate(
                hora_num=Cast(Substr('Hora', 2), IntegerField())  # Extraer número de la hora para poder ordenar
            ).order_by('hora_num')
            serializer = ProduccionSerializer(producciones, many=True)

            # Crear respuesta
            response_data = {
                'nombre_inversor': inversor.nombre,  # Nombre del inversor
                'producciones': serializer.data,  # Producciones completas
                'estadisticas_por_hora': list(producciones_por_hora)  # Estadísticas agrupadas por hora
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