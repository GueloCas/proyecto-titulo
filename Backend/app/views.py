from rest_framework import viewsets
from .models import Inversor, Produccion
from .serializer import InversorSerializer, ProduccionSerializer

# Create your views here.

class InversorViewSet(viewsets.ModelViewSet):
    queryset = Inversor.objects.all()
    serializer_class = InversorSerializer

class ProduccionViewSet(viewsets.ModelViewSet):
    queryset = Produccion.objects.all()
    serializer_class = ProduccionSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
from django.db.models import IntegerField
from django.db.models.functions import Cast, Substr

class ExcelUploadView(APIView):
    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        
        if not file:
            return Response({"error": "No se envió ningún archivo"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Lee el archivo Excel usando pandas
            df = pd.read_excel(file, header=None)
            
            # Aquí puedes procesar los datos, ejemplo guardarlos en la base de datos
            # Recorremos las filas de la hoja de Excel
            for col_index in range(1, len(df.columns)):
                # Obtener el nombre del inversor (primera casilla de la columna)
                nombre_inversor = df.iloc[0, col_index]  # Primer valor de la columna
                print(f"Nombre del Inversor en Columna {col_index + 1}: {nombre_inversor}")

                inversor = Inversor.objects.create(nombre=nombre_inversor)
                print(f"Inversor creado con ID: {inversor.id}")
                
                # Iterar hacia abajo en la columna, comenzando desde la fila 1
                for row_index in range(1, len(df)):
                    valor = df.iloc[row_index, col_index]  # Obtener el valor en la fila actual

                    if pd.notna(valor):
                        periodo = df.iloc[row_index, 0]
                        fecha, hora = periodo.split(', ')
                        print(f"Fila {row_index}, columna {col_index + 1}, fecha: {fecha}, hora: {hora}, valor: {valor}")

                        Produccion.objects.create(
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
        inversor_id = request.query_params.get('inversor_id')
        hora = request.query_params.get('hora')
        print(f"inversor_id: {inversor_id}, hora: {hora}")
        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            inversor = Inversor.objects.get(pk=inversor_id)
            if hora:
                producciones = Produccion.objects.filter(inversor=inversor, Hora=hora)
            else:
                producciones = Produccion.objects.filter(inversor=inversor).annotate(
                    hora_num=Cast(Substr('Hora', 2), IntegerField())  # Extrae desde el segundo carácter
                ).order_by('hora_num')
            serializer = ProduccionSerializer(producciones, many=True)

            response_data = {
                'nombre_inversor': inversor.nombre,  # Asumiendo que el campo es 'nombre'
                'producciones': serializer.data
            }
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)