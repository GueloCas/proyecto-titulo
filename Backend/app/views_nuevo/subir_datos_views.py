from app.models import Inversor, Produccion, Estacion
from rest_framework import status 
from rest_framework.views import APIView 
from rest_framework.response import Response 
import pandas as pd 

import os

import os

class ExcelUploadView(APIView):
    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        print(f"Tipo MIME del archivo: {file.content_type}") 
        
        if not file:
            return Response({"error": "No se envió ningún archivo"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if file.content_type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                # Lee el archivo Excel completo
                xls = pd.ExcelFile(file)
                all_sheets = xls.sheet_names
            elif file.content_type == 'text/csv':
                # CSV no tiene hojas, procesamos como si fuera una sola
                all_sheets = [os.path.splitext(file.name)[0]]  # Usa el nombre del archivo como "nombre de hoja"
                xls = None
            else:
                return Response({"error": "Tipo de archivo no soportado"}, status=status.HTTP_400_BAD_REQUEST)

            for sheet_name in all_sheets:
                if xls:  # Si es un archivo Excel, lee la hoja específica
                    df = pd.read_excel(xls, sheet_name=sheet_name, header=None)
                else:  # Si es CSV, simplemente lo leemos una vez
                    df = pd.read_csv(file, header=None)

                # Crear o recuperar la estación usando el nombre de la hoja o archivo
                estacion, created = Estacion.objects.get_or_create(nombre=sheet_name)
                print(f"Estación '{sheet_name}' {'creada' if created else 'recuperada'} con ID: {estacion.id}")

                producciones = []
                
                # Recorre las columnas de la hoja
                for col_index in range(1, len(df.columns)):
                    # Obtener el nombre del inversor (primera casilla de la columna)
                    nombre_inversor = df.iloc[0, col_index]
                    print(f"Nombre del Inversor en Columna {col_index + 1}: {nombre_inversor}")

                    inversor = Inversor.objects.create(nombre=nombre_inversor, estacion=estacion)
                    print(f"Inversor creado con ID: {inversor.id}")
                    
                    # Iterar hacia abajo en la columna, comenzando desde la fila 1
                    for row_index in range(1, len(df)):
                        valor = df.iloc[row_index, col_index]

                        if pd.notna(valor):  # Si el valor no es nulo
                            periodo = df.iloc[row_index, 0]  # Obtener el periodo de tiempo
                            fecha, hora = periodo.split(', ')  # Separar la fecha y la hora
                            print(f"Fila {row_index}, inversor: {nombre_inversor}, fecha: {fecha}, hora: {hora}, valor: {valor}")

                            produccion = Produccion(  # Crear un objeto Produccion
                                Dia=fecha,
                                Hora=hora,
                                cantidad=valor,
                                inversor=inversor
                            )
                            producciones.append(produccion)

                Produccion.objects.bulk_create(producciones)

            return Response({"message": "Archivo procesado correctamente"}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

