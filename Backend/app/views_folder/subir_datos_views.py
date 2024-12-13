from app.models import Inversor, Produccion, Estacion
from rest_framework import status 
from rest_framework.views import APIView 
from rest_framework.response import Response 
import pandas as pd 
import os
from io import StringIO
from django.contrib.auth.models import User
import json
from app.utils.filters import meses_a_numero

class ExcelUploadView(APIView):
    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        user_json = request.POST.get('user')  # Cambiado a request.POST
        
        if not file:
            return Response({"error": "No se envió ningún archivo"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if file.content_type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return Response({"error": "Archivo no es un Excel válido"}, status=status.HTTP_400_BAD_REQUEST)

            # Deserializar el JSON de `user`
            user_data = json.loads(user_json)

            # Recuperar el objeto de usuario
            try:
                user = User.objects.get(id=user_data['id'])
            except User.DoesNotExist:
                return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

            xls = pd.ExcelFile(file)
            response_data = {
                "nuevos_inversores": [],
                "nuevas_producciones": [],
                "producciones_actualizadas": []
            }

            for sheet_name in xls.sheet_names:
                df = pd.read_excel(xls, sheet_name=sheet_name, header=None)

                # Crear o recuperar la estación
                estacion, created = Estacion.objects.get_or_create(nombre=sheet_name, usuario=user)

                 # Agregar información de la estación creada/recuperada
                if created:
                    response_data["nueva_estacion"] = {"nombre": estacion.nombre, "mensaje": "Estación creada"}
                else:
                    response_data["nueva_estacion"] = {"nombre": estacion.nombre, "mensaje": "Estación ya existente"}

                inversores_existentes = {
                    inv.nombre: inv for inv in Inversor.objects.filter(estacion=estacion)
                }
                nuevos_inversores = []
                nuevas_producciones = []
                actualizaciones_producciones = []

                # Diccionario para producciones existentes
                producciones_dict = {
                    (prod.inversor_id, prod.anio, prod.mes, prod.dia, prod.hora): prod
                    for prod in Produccion.objects.filter(inversor__estacion=estacion)
                }

                for col_index in range(1, len(df.columns)):
                    nombre_inversor = df.iloc[0, col_index]
                    if nombre_inversor not in inversores_existentes:
                        inversor = Inversor(nombre=nombre_inversor, estacion=estacion)
                        nuevos_inversores.append(inversor)
                        response_data["nuevos_inversores"].append(nombre_inversor)

                # Guardar inversores nuevos y actualizar sus IDs
                if nuevos_inversores:
                    Inversor.objects.bulk_create(nuevos_inversores)
                    # Recargar inversores para actualizar IDs
                    inversores_existentes.update({
                        inv.nombre: inv for inv in Inversor.objects.filter(estacion=estacion)
                    })

                # Procesar producciones ahora que todos los inversores tienen IDs
                for col_index in range(1, len(df.columns)):
                    nombre_inversor = df.iloc[0, col_index]
                    inversor = inversores_existentes.get(nombre_inversor)

                    for row_index in range(1, len(df)):
                        valor = df.iloc[row_index, col_index]
                        if pd.notna(valor):
                            periodo = df.iloc[row_index, 0]
                            fecha, hora = periodo.split(', ')
                            input_dia = int(fecha.split('-')[0])
                            input_mes = fecha.split('-')[1]
                            input_anio = int(fecha.split('-')[2])

                            if input_mes.isdigit():
                                input_mes = int(input_mes)
                            else:
                                input_mes = meses_a_numero.get(input_mes.lower(), None)
                                if not input_mes:
                                    raise ValueError(f"Formato de mes no válido: {input_mes}")

                            # Identificador de la producción
                            key = (inversor.id, input_anio, input_mes, input_dia, hora)

                            if key in producciones_dict:
                                prod_existente = producciones_dict[key]
                                prod_existente.cantidad = valor
                                actualizaciones_producciones.append(prod_existente)
                                response_data["producciones_actualizadas"].append({
                                    "inversor": inversor.nombre,  # Nombre del inversor
                                    "fecha": prod_existente.fecha,  # Fecha existente
                                    "hora": prod_existente.hora,  # Hora existente
                                    "cantidad": valor  # Nueva cantidad actualizada
                                })
                            else:
                                nueva_produccion = Produccion(
                                    fecha=fecha,
                                    hora=hora,
                                    cantidad=valor,
                                    inversor=inversor,
                                    anio=input_anio,
                                    mes=input_mes,
                                    dia=input_dia
                                )
                                nuevas_producciones.append(nueva_produccion)
                                response_data["nuevas_producciones"].append({
                                    "inversor": nombre_inversor,
                                    "fecha": fecha,
                                    "hora": hora,
                                    "cantidad": valor
                                })

                # Bulk create y bulk update
                if nuevas_producciones:
                    Produccion.objects.bulk_create(nuevas_producciones)
                if actualizaciones_producciones:
                    Produccion.objects.bulk_update(actualizaciones_producciones, ['cantidad'])

            return Response({
                "message": "Archivo Excel procesado correctamente",
                "data": response_data
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CSVUploadView(APIView):
    def post(self, request, *args, **kwargs):
        # Obtener el archivo CSV enviado
        file = request.FILES.get('file')
        user_json = request.POST.get('user')

        if not file:
            return Response({"error": "No se envió ningún archivo"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Verificar que el archivo es CSV
            if file.content_type != 'text/csv':
                return Response({"error": "Archivo no es un CSV válido"}, status=status.HTTP_400_BAD_REQUEST)
            
            user_data = json.loads(user_json)

            try:
                user = User.objects.get(id=user_data['id'])
            except User.DoesNotExist:
                return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

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
            estacion, created = Estacion.objects.get_or_create(nombre=station_name, usuario=user)

            response_data = {
                "nuevas_producciones": [],
                "producciones_actualizadas": [],
                "nuevos_inversores": [],
                "nueva_estacion": {
                    "nombre": estacion.nombre,
                    "mensaje": "Estación creada" if created else "Estación ya existente"
                }
            }

            inversores = {}
            for col_index in range(0, len(df.columns)):
                nombre_inversor = df.iloc[0, col_index]
                if pd.notna(nombre_inversor) and nombre_inversor.strip():
                    inversor, created = Inversor.objects.get_or_create(nombre=nombre_inversor.strip(), estacion=estacion)
                    inversores[col_index] = inversor
                    if created:
                        response_data["nuevos_inversores"].append(inversor.nombre)

            # Obtener todas las producciones existentes de una vez y almacenarlas en un diccionario
            producciones_existentes = {
                (prod.inversor_id, prod.anio, prod.mes, prod.dia, prod.hora): prod
                for prod in Produccion.objects.filter(inversor__estacion=estacion)
            }

            producciones = []

            for row_index in range(1, len(df)):
                fecha = df.iloc[row_index, 0]
                hora = df.iloc[row_index, 1]

                input_dia = int(fecha.split('-')[0])
                input_mes = (fecha.split('-')[1])
                input_anio = int(fecha.split('-')[2])

                # Convertir mes a número
                try:
                    if input_mes.isdigit():
                        input_mes = int(input_mes)
                    else:
                        input_mes = meses_a_numero[input_mes.lower()]
                except KeyError:
                    raise ValueError(f"Formato de mes no válido: {input_mes}")
                
                for col_index in range(2, len(df.columns)):
                    valor = df.iloc[row_index, col_index]
                    if pd.notna(valor):
                        inversor = inversores.get(col_index - 2)
                        if inversor:
                            # Verificar si la producción ya existe usando el diccionario
                            key = (inversor.id, input_anio, input_mes, input_dia, hora)
                            prod_existente = producciones_existentes.get(key)

                            if prod_existente:
                                # Si existe, actualizar la cantidad
                                prod_existente.cantidad = valor
                                response_data["producciones_actualizadas"].append({
                                    "inversor": inversor.nombre,
                                    "fecha": prod_existente.fecha,
                                    "hora": prod_existente.hora,
                                    "cantidad": valor
                                })
                            else:
                                # Si no existe, crear una nueva producción
                                nueva_produccion = Produccion(
                                    fecha=fecha,
                                    hora=hora,
                                    cantidad=valor,
                                    inversor=inversor,
                                    anio=input_anio,
                                    mes=input_mes,
                                    dia=input_dia
                                )
                                producciones.append(nueva_produccion)
                                response_data["nuevas_producciones"].append({
                                    "inversor": inversor.nombre,
                                    "fecha": fecha,
                                    "hora": hora,
                                    "cantidad": valor
                                })

            # Guardar las producciones en la base de datos
            if producciones:
                Produccion.objects.bulk_create(producciones)
            if producciones_existentes:
                Produccion.objects.bulk_update(producciones_existentes.values(), ['cantidad'])

            return Response({
                "message": "Datos del archivo procesados correctamente",
                "data": response_data
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
