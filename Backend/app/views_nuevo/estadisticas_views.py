from app.models import Inversor, Produccion, Estacion
from rest_framework import status 
from rest_framework.views import APIView 
from rest_framework.response import Response 

class MetricasEstacionView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el parámetro 'estacion' desde los parámetros de la consulta
        id_estacion = request.query_params.get('estacion')

        # Si no se proporciona el parámetro 'estacion', se retorna un error
        if not id_estacion:
            return Response({"error": "Se requiere el parámetro 'estacion'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Filtrar los inversores que están asociados con la estación proporcionada
            inversores = Inversor.objects.filter(estacion_id=id_estacion)

            # Si no se encuentran inversores para la estación proporcionada, retornar un mensaje de error
            if not inversores.exists():
                return Response({"error": "No se encontraron inversores para la estación indicada"}, status=status.HTTP_404_NOT_FOUND)

            # Lista para almacenar los datos de los inversores
            datos_inversores = []

            # Recorrer cada inversor y obtener los datos de producción
            for inversor in inversores:
                # Llamar al método 'obtener_MinMaxProm_producciones' del inversor
                datos_produccion = inversor.obtener_MinMaxProm_producciones()

                # Agregar los datos de cada inversor y su producción a la lista
                datos_inversores.append({
                    'id': inversor.id,
                    'nombre': inversor.nombre,
                    'produccion': datos_produccion,  # Aquí se añaden los datos obtenidos por el método
                })

            # Retornar los datos de los inversores junto con sus producciones
            return Response({'inversores': datos_inversores}, status=status.HTTP_200_OK)

        except Exception as e:
            # Manejar cualquier excepción no esperada
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class MetricasEstacionGeneralMesView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el parámetro 'estacion'
        id_estacion = request.query_params.get('estacion')

        if not id_estacion:
            return Response({"error": "Se requiere el parámetro 'estacion'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Obtener inversores asociados a la estación
            inversores = Inversor.objects.filter(estacion_id=id_estacion)
            if not inversores.exists():
                return Response({"error": "No se encontraron inversores para la estación indicada"}, status=status.HTTP_404_NOT_FOUND)

            # Variables para el total mensual de la estación y días extremos
            total_mensual_estacion = 0
            mejor_inversor_estacion = {"nombre": None, "total": float('-inf')}
            peor_inversor_estacion = {"nombre": None, "total": float('inf')}
            
            datos_inversores = []

            # Mes y año actual (puedes ajustarlo si necesitas otro mes o año)
            mes_actual = "Aug"  # Nombre del mes en inglés
            anio_actual = 2022

            # Recorrer los inversores
            for inversor in inversores:
                total_mensual_inversor = 0
                mejor_dia_inversor = {"dia": None, "produccion": float('-inf')}
                peor_dia_inversor = {"dia": None, "produccion": float('inf')}

                # Calcular total mensual y días extremos por inversor
                for dia in range(1, 32):
                    # Formatear el día como '01-Aug-2022'
                    dia_formateado = f"{dia:02d}-{mes_actual}-{anio_actual}"
                    
                    # Obtener la producción diaria
                    total_diario = inversor.obtener_cantidad_total_diaria(dia_formateado)
                    print(f"Producción diaria de {inversor.nombre} el {dia_formateado}: {total_diario}")
                    total_mensual_inversor += total_diario
                    
                    # Actualizar mejor y peor día del inversor
                    if total_diario > mejor_dia_inversor["produccion"]:
                        mejor_dia_inversor = {"dia": dia_formateado, "produccion": total_diario}
                    if total_diario < peor_dia_inversor["produccion"]:
                        peor_dia_inversor = {"dia": dia_formateado, "produccion": total_diario}

                if total_mensual_inversor > mejor_inversor_estacion["total"]:
                    mejor_inversor_estacion = {"nombre": inversor.nombre, "total": total_mensual_inversor}
                if total_mensual_inversor < peor_inversor_estacion["total"]:
                    peor_inversor_estacion = {"nombre": inversor.nombre, "total": total_mensual_inversor}

                # Acumular total mensual de la estación
                total_mensual_estacion += total_mensual_inversor

                # Agregar datos del inversor al resultado
                datos_inversores.append({
                    "id_inversor": inversor.id,
                    "nombre": inversor.nombre,
                    "total_mensual": total_mensual_inversor,
                    "mejor_dia": mejor_dia_inversor,
                    "peor_dia": peor_dia_inversor,
                })

            promedio_inversor_estacion = total_mensual_estacion / len(inversores)

            # Respuesta final con datos de inversores y estación
            return Response({
                "estacion": {
                    "id_estacion": id_estacion,
                    "total_mensual": total_mensual_estacion,
                    "promedio_inversor": promedio_inversor_estacion,
                    "mejor_inversor": mejor_inversor_estacion,
                    "peor_inversor": peor_inversor_estacion,
                },
                "inversores": datos_inversores,
            })

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
class MetricasEstacionGeneralDiaView(APIView):
    def get(self, request, *args, **kwargs):
        id_estacion = request.query_params.get('estacion')
        dia = request.query_params.get('dia')
        dia_int = int(dia) if isinstance(dia, str) else dia

        if not id_estacion:
            return Response({"error": "Se requiere el parámetro 'estacion'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            inversores = Inversor.objects.filter(estacion_id=id_estacion)
            if not inversores.exists():
                return Response({"error": "No se encontraron inversores para la estación indicada"}, status=status.HTTP_404_NOT_FOUND)

            # Día formateado
            # Mes y año actual (ajustable según lo necesites)
            mes_actual = "Aug"  # Nombre del mes en inglés
            anio_actual = 2022
            dia_formateado = f"{dia_int:02d}-{mes_actual}-{anio_actual}"

            # Variables para el total diario de la estación y horas extremas
            total_diario_estacion = 0
            mejor_inversor_estacion = {"nombre": None, "total": float('-inf')}
            peor_inversor_estacion = {"nombre": None, "total": float('inf')}
            
            datos_inversores = []

            for inversor in inversores:
                # Filtrar producciones para el inversor en el día dado
                producciones = Produccion.objects.filter(inversor=inversor, Dia=dia_formateado)
                total_diario_inversor = sum(produccion.cantidad for produccion in producciones)
                total_diario_estacion += total_diario_inversor

                # Comparar para encontrar el mejor y peor inversor de la estación
                if total_diario_inversor > mejor_inversor_estacion["total"]:
                    mejor_inversor_estacion = {"nombre": inversor.nombre, "total": total_diario_inversor}
                if total_diario_inversor < peor_inversor_estacion["total"]:
                    peor_inversor_estacion = {"nombre": inversor.nombre, "total": total_diario_inversor}

                mejor_hora_inversor = {"hora": None, "produccion": float('-inf')}
                peor_hora_inversor = {"hora": None, "produccion": float('inf')}

                # Iterar sobre las producciones por hora de ese día
                for produccion in producciones:
                    hora_str = produccion.Hora  # "H1", "H2", "H3", etc.
                    hora_num = int(hora_str[1:])  # Extraemos el número, p.ej. "H1" -> 1

                    total_hora = produccion.cantidad

                    if total_hora > mejor_hora_inversor["produccion"]:
                        mejor_hora_inversor = {"hora": hora_str, "produccion": total_hora}
                    if total_hora < peor_hora_inversor["produccion"]:
                        peor_hora_inversor = {"hora": hora_str, "produccion": total_hora}

                datos_inversores.append({
                    "id_inversor": inversor.id,
                    "nombre": inversor.nombre,
                    "total_diario": total_diario_inversor,
                    "mejor_hora": mejor_hora_inversor,
                    "peor_hora": peor_hora_inversor,
                })

            promedio_diario_estacion = total_diario_estacion / len(inversores)

            return Response({
                "estacion": {
                    "id_estacion": id_estacion,
                    "total_diario": total_diario_estacion,
                    "promedio_inversor": promedio_diario_estacion,
                    "mejor_inversor": mejor_inversor_estacion,
                    "peor_inversor": peor_inversor_estacion,
                },
                "inversores": datos_inversores,
            })
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class MetricasEstacionHoraDiaView(APIView):
    def get(self, request, *args, **kwargs):
        id_estacion = request.query_params.get('estacion')
        hora = request.query_params.get('hora')
        hora_formateada = f"H{hora}" 
        dia = request.query_params.get('dia')
        dia_int = int(dia) if isinstance(dia, str) else dia

        if not id_estacion:
            return Response({"error": "Se requiere el parámetro 'estacion'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            inversores = Inversor.objects.filter(estacion_id=id_estacion)
            if not inversores.exists():
                return Response({"error": "No se encontraron inversores para la estación indicada"}, status=status.HTTP_404_NOT_FOUND)
            
            # Día formateado
            # Mes y año actual (ajustable según lo necesites)
            mes_actual = "Aug"  # Nombre del mes en inglés
            anio_actual = 2022
            dia_formateado = f"{dia_int:02d}-{mes_actual}-{anio_actual}"

            total_hora_estacion = 0
            mejor_inversor_estacion = {"nombre": None, "total": float('-inf')}
            peor_inversor_estacion = {"nombre": None, "total": float('inf')}
            
            datos_inversores = []

            for inversor in inversores:
                 # Filtrar producciones para el inversor en el día dado
                produccion = Produccion.objects.filter(inversor=inversor, Dia=dia_formateado, Hora=hora_formateada).first()
                promedio_mensual = inversor.obtener_MinMaxProm_producciones_hora(hora_formateada)
                total_hora_estacion += produccion.cantidad

                if produccion.cantidad > mejor_inversor_estacion["total"]:
                    mejor_inversor_estacion = {"nombre": inversor.nombre, "total": produccion.cantidad}
                if produccion.cantidad < peor_inversor_estacion["total"]:
                    peor_inversor_estacion = {"nombre": inversor.nombre, "total": produccion.cantidad}

                datos_inversores.append({
                    "id_inversor": inversor.id,
                    "nombre": inversor.nombre,
                    "produccion": produccion.cantidad,
                    "promedio_mensual": promedio_mensual[0]['cantidad_promedio'],
                })

            promedio_hora_estacion = total_hora_estacion / len(inversores)

            return Response({
                "estacion": {
                    "id_estacion": id_estacion,
                    "total_hora": total_hora_estacion,
                    "promedio_inversor": promedio_hora_estacion,
                    "mejor_inversor": mejor_inversor_estacion,
                    "peor_inversor": peor_inversor_estacion,
                },
                "inversores": datos_inversores,
            })
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


            
            


            
            
