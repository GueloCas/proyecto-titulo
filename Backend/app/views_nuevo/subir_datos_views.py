from app.models import Inversor, Produccion, Estacion
from rest_framework import status 
from rest_framework.views import APIView 
from rest_framework.response import Response 
import pandas as pd 
import os
from io import StringIO

class ExcelUploadView(APIView):
    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        
        if not file:
            return Response({"error": "No se envió ningún archivo"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if file.content_type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return Response({"error": "Archivo no es un Excel válido"}, status=status.HTTP_400_BAD_REQUEST)
            
            xls = pd.ExcelFile(file)
            for sheet_name in xls.sheet_names:
                df = pd.read_excel(xls, sheet_name=sheet_name, header=None)

                # Crear o recuperar la estación
                estacion, created = Estacion.objects.get_or_create(nombre=sheet_name)
                producciones = []

                for col_index in range(1, len(df.columns)):
                    nombre_inversor = df.iloc[0, col_index]
                    inversor, _ = Inversor.objects.get_or_create(nombre=nombre_inversor, estacion=estacion)

                    for row_index in range(1, len(df)):
                        valor = df.iloc[row_index, col_index]
                        if pd.notna(valor):
                            periodo = df.iloc[row_index, 0]
                            fecha, hora = periodo.split(', ')
                            
                            produccion = Produccion(
                                Dia=fecha,
                                Hora=hora,
                                cantidad=valor,
                                inversor=inversor
                            )
                            producciones.append(produccion)

                Produccion.objects.bulk_create(producciones)

            return Response({"message": "Archivo Excel procesado correctamente"}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CSVUploadView(APIView):
    def post(self, request, *args, **kwargs):
        # Obtener el archivo CSV enviado
        file = request.FILES.get('file')

        if not file:
            return Response({"error": "No se envió ningún archivo"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Verificar que el archivo es CSV
            if file.content_type != 'text/csv':
                return Response({"error": "Archivo no es un CSV válido"}, status=status.HTTP_400_BAD_REQUEST)

            # Leer el archivo CSV como un string
            csv_text = file.read().decode('utf-8')

            # Separar las líneas y procesarlas
            lines = csv_text.splitlines()

            # La primera línea contiene los nombres de los inversores (9 columnas)
            headers = lines[0].split(',')

            # Ajustar la primera línea agregando columnas vacías para que tenga 11 columnas
            adjusted_first_row = headers + [''] * (11 - len(headers))  # Agregar 2 columnas vacías

            # Las siguientes filas tienen 11 columnas, las procesamos tal cual
            adjusted_lines = [','.join(adjusted_first_row)]  # Incluir la primera línea ajustada
            adjusted_lines.extend(lines[1:])  # Añadir el resto de líneas sin cambios

            # Crear un nuevo CSV ajustado
            adjusted_csv = '\n'.join(adjusted_lines)

            # Leer el CSV ajustado en un DataFrame de pandas
            df = pd.read_csv(StringIO(adjusted_csv), header=None)

            # Asignar los nombres de las columnas (la primera fila ahora tiene 11 columnas)
            column_names = ['Fecha', 'Hora'] + [f"Inversor_{i}" for i in range(1, len(df.columns) - 1)]
            df.columns = column_names

            # Verificar que el archivo contiene datos
            if df.empty or len(df.columns) < 3:
                return Response({"error": "El archivo CSV no contiene los datos esperados"}, status=status.HTTP_400_BAD_REQUEST)

            # Crear o recuperar la estación
            station_name = file.name.split('.')[0]
            estacion, _ = Estacion.objects.get_or_create(nombre=station_name)

            producciones = []

            # Obtener los nombres de los inversores reales de la primera fila
            inversores = {}
            for col_index in range(0, len(df.columns)):  # Comenzar desde la columna 2 porque las dos primeras son Fecha y Hora
                nombre_inversor = df.iloc[0, col_index]  # Tomamos el nombre del inversor desde la primera fila
                print(nombre_inversor)
                
                # Validar que el nombre no esté vacío o sea NaN
                if pd.notna(nombre_inversor) and nombre_inversor.strip():
                    inversor, _ = Inversor.objects.get_or_create(nombre=nombre_inversor.strip(), estacion=estacion)
                    inversores[col_index] = inversor

            print(inversores)

            for row_index in range(1, len(df)):
                fecha = df.iloc[row_index, 0]
                hora = df.iloc[row_index, 1]
                
                for col_index in range(2, len(df.columns)):
                    valor = df.iloc[row_index, col_index]
                    if pd.notna(valor):
                        inversor = inversores.get(col_index - 2)
                        if inversor:  # Validar que el inversor exista
                            produccion = Produccion(
                                Dia=fecha,
                                Hora=hora,
                                cantidad=valor,
                                inversor=inversor
                            )
                            producciones.append(produccion)

            # Guardar las producciones en la base de datos
            Produccion.objects.bulk_create(producciones)

            return Response({"message": "Datos del archivo procesados correctamente"}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
