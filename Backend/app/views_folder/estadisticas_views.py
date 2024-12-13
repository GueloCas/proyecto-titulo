from app.models import Inversor, Produccion, Estacion
from rest_framework import status 
from rest_framework.views import APIView 
from rest_framework.response import Response 
import calendar
from rest_framework.authtoken.models import Token

class MetricasEstacionHoraMesView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')  # O usa 'Authorization' en headers
        
        if not token:
            return Response({"detail": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        user_token = Token.objects.get(key=token)
        user = user_token.user  # Obtén el usuario asociado con el token

        # Obtener el parámetro 'estacion' desde los parámetros de la consulta
        id_estacion = request.query_params.get('estacion')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')
        hora = request.query_params.get('hora')
        hora_formateada = f"H{hora}" 

        # Si no se proporciona el parámetro 'estacion', se retorna un error
        if not id_estacion:
            return Response({"error": "Se requiere el parámetro 'estacion'"}, status=status.HTTP_400_BAD_REQUEST)
        if not anio:
            return Response({"error": "Se requiere el parámetro 'anio'"}, status=status.HTTP_400_BAD_REQUEST)
        if not mes:
            return Response({"error": "Se requiere el parámetro 'mes'"}, status=status.HTTP_400_BAD_REQUEST)
        if not hora:
            return Response({"error": "Se requiere el parámetro 'hora'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            estacion = Estacion.objects.get(pk=id_estacion)

            if estacion.usuario != user:
                return Response({"error": "No tienes permiso para acceder a esta estación"}, status=status.HTTP_403_FORBIDDEN)

            # Filtrar los inversores que están asociados con la estación proporcionada
            inversores = Inversor.objects.filter(estacion_id=estacion)

            # Si no se encuentran inversores para la estación proporcionada, retornar un mensaje de error
            if not inversores.exists():
                return Response({"error": "No se encontraron inversores para la estación indicada"}, status=status.HTTP_404_NOT_FOUND)
            
            total_mensual_estacion = 0
            mejor_inversor_estacion = {"nombre": None, "total": float('-inf')}
            peor_inversor_estacion = {"nombre": None, "total": float('inf')}

            # Lista para almacenar los datos de los inversores
            datos_inversores = []

            # Recorrer cada inversor y obtener los datos de producción
            for inversor in inversores:
                # Llamar al método 'obtener_MinMaxProm_producciones' del inversor
                datos_produccion = inversor.obtener_MinMaxProm_producciones_hora(anio, mes, hora_formateada)
                total_produccion = datos_produccion[0]['cantidad_promedio']
                total_mensual_estacion += total_produccion

                if total_produccion > mejor_inversor_estacion["total"]:
                    mejor_inversor_estacion = {"nombre": inversor.nombre, "total": total_produccion}
                if total_produccion < peor_inversor_estacion["total"]:
                    peor_inversor_estacion = {"nombre": inversor.nombre, "total": total_produccion}

                # Agregar los datos de cada inversor y su producción a la lista
                datos_inversores.append({
                    'id': inversor.id,
                    'nombre': inversor.nombre,
                    'produccion': datos_produccion,  # Aquí se añaden los datos obtenidos por el método
                })
            
            promedio_inversor_estacion = total_mensual_estacion / len(inversores)
            
            return Response({
                "estacion": {
                    "nombre": estacion.nombre,
                    "total_mensual": total_mensual_estacion,
                    "promedio_inversor": promedio_inversor_estacion,
                    "mejor_inversor": mejor_inversor_estacion,
                    "peor_inversor": peor_inversor_estacion,
                },
                "inversores": datos_inversores,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # Manejar cualquier excepción no esperada
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class MetricasEstacionGeneralMesView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')  # O usa 'Authorization' en headers
        
        if not token:
            return Response({"detail": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        user_token = Token.objects.get(key=token)
        user = user_token.user  # Obtén el usuario asociado con el token

        # Obtener el parámetro 'estacion'
        id_estacion = request.query_params.get('estacion')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')

        if not id_estacion:
            return Response({"error": "Se requiere el parámetro 'estacion'"}, status=status.HTTP_400_BAD_REQUEST)
        if not anio:
            return Response({"error": "Se requiere el parámetro 'anio'"}, status=status.HTTP_400_BAD_REQUEST)
        if not mes:
            return Response({"error": "Se requiere el parámetro 'mes'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            num_dias_mes = calendar.monthrange(int(anio), int(mes))[1] 

            estacion = Estacion.objects.get(pk=id_estacion)

            if estacion.usuario != user:
                return Response({"error": "No tienes permiso para acceder a esta estación"}, status=status.HTTP_403_FORBIDDEN)

            # Obtener inversores asociados a la estación
            inversores = Inversor.objects.filter(estacion_id=estacion)
            if not inversores.exists():
                return Response({"error": "No se encontraron inversores para la estación indicada"}, status=status.HTTP_404_NOT_FOUND)

            # Variables para el total mensual de la estación y días extremos
            total_mensual_estacion = 0
            mejor_inversor_estacion = {"nombre": None, "total": float('-inf')}
            peor_inversor_estacion = {"nombre": None, "total": float('inf')}
            
            datos_inversores = []

            # Recorrer los inversores
            for inversor in inversores:
                total_mensual_inversor = 0
                mejor_dia_inversor = {"dia": None, "produccion": float('-inf')}
                peor_dia_inversor = {"dia": None, "produccion": float('inf')}

                # Calcular total mensual y días extremos por inversor
                for dia in range(1, num_dias_mes + 1):
                    # Obtener la producción diaria
                    total_diario = inversor.obtener_cantidad_total_diaria(anio, mes, dia)
                    total_mensual_inversor += total_diario
                    
                    # Actualizar mejor y peor día del inversor
                    if total_diario > mejor_dia_inversor["produccion"]:
                        mejor_dia_inversor = {"dia": dia, "produccion": total_diario}
                    if total_diario < peor_dia_inversor["produccion"]:
                        peor_dia_inversor = {"dia": dia, "produccion": total_diario}

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
                    "nombre": estacion.nombre,
                    "total_mensual": total_mensual_estacion,
                    "promedio_inversor": promedio_inversor_estacion,
                    "mejor_inversor": mejor_inversor_estacion,
                    "peor_inversor": peor_inversor_estacion,
                },
                "inversores": datos_inversores,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
class MetricasEstacionGeneralDiaView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')  # O usa 'Authorization' en headers
        
        if not token:
            return Response({"detail": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        user_token = Token.objects.get(key=token)
        user = user_token.user  # Obtén el usuario asociado con el token

        id_estacion = request.query_params.get('estacion')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')
        dia = request.query_params.get('dia')

        if not id_estacion:
            return Response({"error": "Se requiere el parámetro 'estacion'"}, status=status.HTTP_400_BAD_REQUEST)
        if not anio:
            return Response({"error": "Se requiere el parámetro 'anio'"}, status=status.HTTP_400_BAD_REQUEST)
        if not mes:
            return Response({"error": "Se requiere el parámetro 'mes'"}, status=status.HTTP_400_BAD_REQUEST)
        if not dia:
            return Response({"error": "Se requiere el parámetro 'dia'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            estacion = Estacion.objects.get(pk=id_estacion)

            if estacion.usuario != user:
                return Response({"error": "No tienes permiso para acceder a esta estación"}, status=status.HTTP_403_FORBIDDEN)

            inversores = Inversor.objects.filter(estacion_id=estacion)
            if not inversores.exists():
                return Response({"error": "No se encontraron inversores para la estación indicada"}, status=status.HTTP_404_NOT_FOUND)

            # Variables para el total diario de la estación y horas extremas
            total_diario_estacion = 0
            mejor_inversor_estacion = {"nombre": None, "total": float('-inf')}
            peor_inversor_estacion = {"nombre": None, "total": float('inf')}
            
            datos_inversores = []

            for inversor in inversores:
                # Filtrar producciones para el inversor en el día dado
                producciones = Produccion.objects.filter(inversor=inversor, anio=anio, mes=mes, dia=dia)
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
                    hora_str = produccion.hora  # "H1", "H2", "H3", etc.

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
                    "nombre": estacion.nombre,
                    "total_diario": total_diario_estacion,
                    "promedio_inversor": promedio_diario_estacion,
                    "mejor_inversor": mejor_inversor_estacion,
                    "peor_inversor": peor_inversor_estacion,
                },
                "inversores": datos_inversores,
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class MetricasEstacionHoraDiaView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')  # O usa 'Authorization' en headers
        
        if not token:
            return Response({"detail": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        user_token = Token.objects.get(key=token)
        user = user_token.user  # Obtén el usuario asociado con el token

        id_estacion = request.query_params.get('estacion')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')
        dia = request.query_params.get('dia')
        hora = request.query_params.get('hora')
        hora_formateada = f"H{hora}" 

        if not id_estacion:
            return Response({"error": "Se requiere el parámetro 'estacion'"}, status=status.HTTP_400_BAD_REQUEST)
        if not anio:
            return Response({"error": "Se requiere el parámetro 'anio'"}, status=status.HTTP_400_BAD_REQUEST)
        if not mes:
            return Response({"error": "Se requiere el parámetro 'mes'"}, status=status.HTTP_400_BAD_REQUEST)
        if not dia:
            return Response({"error": "Se requiere el parámetro 'dia'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            estacion = Estacion.objects.get(pk=id_estacion)

            if estacion.usuario != user:
                return Response({"error": "No tienes permiso para acceder a esta estación"}, status=status.HTTP_403_FORBIDDEN)

            inversores = Inversor.objects.filter(estacion_id=estacion)
            if not inversores.exists():
                return Response({"error": "No se encontraron inversores para la estación indicada"}, status=status.HTTP_404_NOT_FOUND)

            total_hora_estacion = 0
            mejor_inversor_estacion = {"nombre": None, "total": float('-inf')}
            peor_inversor_estacion = {"nombre": None, "total": float('inf')}
            
            datos_inversores = []

            for inversor in inversores:
                 # Filtrar producciones para el inversor en el día dado
                produccion = Produccion.objects.filter(inversor=inversor, anio=anio, mes=mes, dia=dia, hora=hora_formateada).first()
                promedio_mensual = inversor.obtener_MinMaxProm_producciones_hora(anio, mes, hora_formateada)
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
                    "nombre": estacion.nombre,
                    "total_hora": total_hora_estacion,
                    "promedio_inversor": promedio_hora_estacion,
                    "mejor_inversor": mejor_inversor_estacion,
                    "peor_inversor": peor_inversor_estacion,
                },
                "inversores": datos_inversores,
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MetricasInversorMesView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')  # O usa 'Authorization' en headers
        
        if not token:
            return Response({"detail": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        user_token = Token.objects.get(key=token)
        user = user_token.user  # Obtén el usuario asociado con el token

        id_inversor = request.query_params.get('inversor')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')

        if not id_inversor:
            return Response({"error": "Se requiere el parámetro 'inversor'"}, status=status.HTTP_400_BAD_REQUEST)
        if not anio:
            return Response({"error": "Se requiere el parámetro 'anio'"}, status=status.HTTP_400_BAD_REQUEST)
        if not mes:
            return Response({"error": "Se requiere el parámetro 'mes'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtener el inversor por ID
            inversor = Inversor.objects.get(pk=id_inversor)

            if inversor.estacion.usuario != user:
                return Response({"error": "No tienes permiso para acceder a este inversor"}, status=status.HTTP_403_FORBIDDEN)

            # Agrupar las producciones por hora y calcular estadísticas agregadas
            estadisticas_por_hora = inversor.obtener_MinMaxProm_producciones(anio, mes)

            response_data = {
                "inversor":{
                    "nombre": inversor.nombre,
                },
                "estadisticas": estadisticas_por_hora,
            }

            return Response(response_data, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor indicado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)