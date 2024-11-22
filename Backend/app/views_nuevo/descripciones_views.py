from app.models import Inversor, Produccion, Estacion
from rest_framework import status 
from rest_framework.views import APIView 
from rest_framework.response import Response
from app.utils.functions import obtenerPercepcionComputacionalPrimerGrado, calcular_pertenencia_baja, calcular_pertenencia_media, calcular_pertenencia_alta, obtenerClasificacionDescripcionLinguistica 

class CalcularDescripcionesLinguisticasInversor(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ID del inversor de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor_id')
        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            inversor = Inversor.objects.get(pk=inversor_id)
        except Inversor.DoesNotExist:
            return Response({"error": "Inversor no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        cantidad_r = 0
        suma_baja = 0
        suma_media = 0
        suma_alta = 0

        try:
            for dia in range(1, 32):  # Ciclo por días del mes
                mes_actual = "Aug"  # Cambiar esto según sea necesario
                anio_actual = 2022
                dia_formateado = f"{dia:02d}-{mes_actual}-{anio_actual}"
                print(dia_formateado)

                for hora in range(8, 23):  # Ciclo por horas del día
                    hora_str = f'H{hora}'
                    
                    produccion = Produccion.objects.filter(
                        Dia=dia_formateado, inversor=inversor, Hora=hora_str
                    ).values('cantidad').first()

                    if not produccion:
                        continue  # Si no hay producción, pasar a la siguiente hora

                    cantidad = produccion['cantidad']

                    # Obtener estadísticas para calcular términos lingüísticos
                    estadisticas_hora = inversor.obtener_MinMaxProm_producciones_hora(hora_str).first()
                    if not estadisticas_hora:
                        continue  # Si no hay estadísticas, pasar a la siguiente hora

                    TLbaja, TLmedia, TLalta = obtenerPercepcionComputacionalPrimerGrado(
                        estadisticas_hora['cantidad_minima'],
                        estadisticas_hora['cantidad_maxima']
                    )

                    # Calcular las pertenencias
                    pertenencia_baja = calcular_pertenencia_baja(cantidad, TLbaja)
                    pertenencia_media = calcular_pertenencia_media(cantidad, TLmedia)
                    pertenencia_alta = calcular_pertenencia_alta(cantidad, TLalta)
                    print(hora_str, pertenencia_baja, pertenencia_media, pertenencia_alta)

                    # Acumular las pertenencias
                    cantidad_r += 1
                    suma_baja += pertenencia_baja
                    suma_media += pertenencia_media
                    suma_alta += pertenencia_alta

            # Devolver las sumas totales
            return Response({
                "cantidad_r": cantidad_r,
                "suma_baja": suma_baja,
                "DL_baja": obtenerClasificacionDescripcionLinguistica(suma_baja / cantidad_r, "baja"),
                "suma_media": suma_media,
                "DL_media": obtenerClasificacionDescripcionLinguistica(suma_media / cantidad_r, "media"),
                "suma_alta": suma_alta,
                "DL_alta": obtenerClasificacionDescripcionLinguistica(suma_alta / cantidad_r, "alta")
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class CalcularDescripcionesLinguisticasEstacion(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ID de la estación de los parámetros de la solicitud
        estacion_id = request.query_params.get('estacion_id')
        if not estacion_id:
            return Response({"error": "Se requiere el parámetro 'estacion_id'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            estacion = Estacion.objects.get(pk=estacion_id)
        except Estacion.DoesNotExist:
            return Response({"error": "Estación no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        cantidad_r = 0
        suma_mala = 0
        suma_normal = 0
        suma_excelente = 0
        inversores_info = []  # Lista para almacenar las descripciones de cada inversor

        try:
            # Obtener los inversores asociados a la estación
            inversores = Inversor.objects.filter(estacion=estacion)

            for inversor in inversores:  # Iterar sobre cada inversor
                suma_baja = 0
                suma_media = 0
                suma_alta = 0
                cantidad_inversor = 0  # Para contar las producciones del inversor

                for dia in range(1, 32):  # Ciclo por días del mes
                    mes_actual = "Aug"  # Cambiar esto según sea necesario
                    anio_actual = 2022
                    dia_formateado = f"{dia:02d}-{mes_actual}-{anio_actual}"

                    for hora in range(8, 23):  # Ciclo por horas del día
                        hora_str = f'H{hora}'

                        produccion = Produccion.objects.filter(
                            Dia=dia_formateado, inversor=inversor, Hora=hora_str
                        ).values('cantidad').first()

                        if not produccion:
                            continue  # Si no hay producción, pasar a la siguiente hora

                        cantidad = produccion['cantidad']

                        # Obtener estadísticas para calcular términos lingüísticos
                        estadisticas_hora = inversor.obtener_MinMaxProm_producciones_hora(hora_str).first()
                        if not estadisticas_hora:
                            continue  # Si no hay estadísticas, pasar a la siguiente hora

                        TLbaja, TLmedia, TLalta = obtenerPercepcionComputacionalPrimerGrado(
                            estadisticas_hora['cantidad_minima'],
                            estadisticas_hora['cantidad_maxima']
                        )

                        # Calcular las pertenencias
                        pertenencia_baja = calcular_pertenencia_baja(cantidad, TLbaja)
                        pertenencia_media = calcular_pertenencia_media(cantidad, TLmedia)
                        pertenencia_alta = calcular_pertenencia_alta(cantidad, TLalta)

                        # Acumular las pertenencias para la estación
                        cantidad_r += 1
                        suma_mala += pertenencia_baja
                        suma_normal += pertenencia_media
                        suma_excelente += pertenencia_alta

                        # Acumular las pertenencias para el inversor
                        suma_baja += pertenencia_baja
                        suma_media += pertenencia_media
                        suma_alta += pertenencia_alta
                        cantidad_inversor += 1

                # Si el inversor tiene producciones, calcular sus descripciones
                if cantidad_inversor > 0:
                    inversor_info = {
                        'inversor_id': inversor.id,
                        'inversor_nombre': inversor.nombre,  # Asegúrate de tener el campo nombre en el modelo Inversor
                        'cantidad_r_inversor': cantidad_inversor,
                        'suma_baja_inversor': suma_baja,
                        'DL_baja_inversor': obtenerClasificacionDescripcionLinguistica(suma_baja / cantidad_inversor, "baja"),
                        'suma_media_inversor': suma_media,
                        'DL_media_inversor': obtenerClasificacionDescripcionLinguistica(suma_media / cantidad_inversor, "media"),
                        'suma_alta_inversor': suma_alta,
                        'DL_alta_inversor': obtenerClasificacionDescripcionLinguistica(suma_alta / cantidad_inversor, "alta")
                    }
                    inversores_info.append(inversor_info)

            # Devolver las sumas totales para la estación y las descripciones de cada inversor
            return Response({
                "cantidad_r": cantidad_r,
                "suma_mala": suma_mala,
                "DL_mala": obtenerClasificacionDescripcionLinguistica(suma_mala / cantidad_r, "mala"),
                "suma_normal": suma_normal,
                "DL_normal": obtenerClasificacionDescripcionLinguistica(suma_normal / cantidad_r, "normal"),
                "suma_excelente": suma_excelente,
                "DL_excelente": obtenerClasificacionDescripcionLinguistica(suma_excelente / cantidad_r, "excelente"),
                "inversores_info": inversores_info  # Incluir las descripciones de cada inversor
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


