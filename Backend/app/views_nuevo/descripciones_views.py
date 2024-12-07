from app.models import Inversor, Produccion, Estacion
from rest_framework import status 
from rest_framework.views import APIView 
from rest_framework.response import Response
from app.utils.functions import obtenerPercepcionComputacionalPrimerGrado, calcular_pertenencia_baja, calcular_pertenencia_media, calcular_pertenencia_alta, obtenerClasificacionDescripcionLinguistica 

from concurrent.futures import ThreadPoolExecutor
from django.db.models import Min, Max

class CalcularDescripcionesLinguisticasInversor(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor_id')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')

        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        if not anio:
            return Response({"error": "Se requiere el parámetro 'anio'"}, status=status.HTTP_400_BAD_REQUEST)
        if not mes:
            return Response({"error": "Se requiere el parámetro 'mes'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validar que el inversor exista
            inversor = Inversor.objects.get(pk=inversor_id)
        except Inversor.DoesNotExist:
            return Response({"error": "Inversor no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            # Cargar todas las producciones del mes
            producciones = Produccion.objects.filter(
                inversor=inversor, anio=anio, mes=mes
            ).values('dia', 'hora', 'cantidad')
            
            # Organizar producciones en un diccionario
            producciones_dict = {(p['dia'], p['hora']): p['cantidad'] for p in producciones}

            # Obtener estadísticas por hora de forma masiva
            estadisticas = Produccion.objects.filter(
                inversor=inversor, anio=anio, mes=mes
            ).values('hora').annotate(
                cantidad_minima=Min('cantidad'),
                cantidad_maxima=Max('cantidad')
            )
            
            # Organizar estadísticas en un diccionario
            estadisticas_dict = {e['hora']: e for e in estadisticas}

            # Listas para almacenar días y horas únicos con datos
            dias_unicos = set()
            horas_unicas = set()

            # Función para procesar un día
            def procesar_dia(dia):
                dia_pertenencias = {}

                for hora in range(1, 25):
                    hora_str = f'H{hora}'
                    cantidad = producciones_dict.get((dia, hora_str))
                    if cantidad is None:
                        continue

                    estadisticas_hora = estadisticas_dict.get(hora_str)
                    if not estadisticas_hora:
                        continue

                    TLbaja, TLmedia, TLalta = obtenerPercepcionComputacionalPrimerGrado(
                        estadisticas_hora['cantidad_minima'],
                        estadisticas_hora['cantidad_maxima']
                    )

                    pertenencia_baja = calcular_pertenencia_baja(cantidad, TLbaja)
                    pertenencia_media = calcular_pertenencia_media(cantidad, TLmedia)
                    pertenencia_alta = calcular_pertenencia_alta(cantidad, TLalta)

                    # Agregar percepciones por hora y día
                    dia_pertenencias[hora] = {
                        "pertenencia_baja": pertenencia_baja,
                        "pertenencia_media": pertenencia_media,
                        "pertenencia_alta": pertenencia_alta
                    }

                    # Añadir día y hora a las listas de valores únicos
                    dias_unicos.add(dia)
                    horas_unicas.add(hora)

                return dia, dia_pertenencias

            # Procesar días en paralelo
            with ThreadPoolExecutor() as executor:
                resultados = list(executor.map(procesar_dia, range(1, 32)))

            # Agrupar los resultados por día
            percepciones_dias = {dia: dia_pertenencias for dia, dia_pertenencias in resultados}

            # Calcular totales y clasificaciones
            cantidad_r, suma_baja, suma_media, suma_alta = 0, 0, 0, 0
            for dia, dia_pertenencias in percepciones_dias.items():
                for hora, percepcion in dia_pertenencias.items():
                    cantidad_r += 1
                    suma_baja += percepcion['pertenencia_baja']
                    suma_media += percepcion['pertenencia_media']
                    suma_alta += percepcion['pertenencia_alta']

            # Devolver las descripciones lingüísticas, las pertenencias y los días/horas válidos
            return Response({
                "inversor" : inversor.nombre,
                "cantidad_r": cantidad_r,
                "suma_baja": suma_baja,
                "DL_baja": obtenerClasificacionDescripcionLinguistica(suma_baja / cantidad_r, "baja"),
                "suma_media": suma_media,
                "DL_media": obtenerClasificacionDescripcionLinguistica(suma_media / cantidad_r, "media"),
                "suma_alta": suma_alta,
                "DL_alta": obtenerClasificacionDescripcionLinguistica(suma_alta / cantidad_r, "alta"),
                "percepciones": percepciones_dias,
                "dias_unicos": list(dias_unicos),  # Lista con días únicos
                "horas_unicas": list(horas_unicas)  # Lista con horas únicas
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CalcularDescripcionesLinguisticasEstacion(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener parámetros de la solicitud
        estacion_id = request.query_params.get('estacion_id')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')

        # Validaciones
        if not estacion_id or not anio or not mes:
            return Response({"error": "Faltan parámetros requeridos: 'estacion_id', 'anio' o 'mes'."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            estacion = Estacion.objects.get(pk=estacion_id)
        except Estacion.DoesNotExist:
            return Response({"error": "Estación no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Obtener inversores y sus producciones de forma optimizada
            inversores = Inversor.objects.filter(estacion=estacion).prefetch_related('produccion_set')

            cantidad_r = 0
            suma_mala = 0
            suma_normal = 0
            suma_excelente = 0
            inversores_info = []  # Almacena las descripciones de cada inversor

            # Agregar los datos por inversor
            for inversor in inversores:
                suma_baja = suma_media = suma_alta = cantidad_inversor = 0

                # Filtrar las producciones del mes y año
                producciones = Produccion.objects.filter(
                    inversor=inversor, anio=anio, mes=mes
                ).values('dia', 'hora', 'cantidad')

                # Organizar producciones por día y hora
                producciones_dict = {(p['dia'], p['hora']): p['cantidad'] for p in producciones}

                # Obtener estadísticas por hora de forma masiva
                estadisticas = Produccion.objects.filter(
                    inversor=inversor, anio=anio, mes=mes
                ).values('hora').annotate(
                    cantidad_minima=Min('cantidad'),
                    cantidad_maxima=Max('cantidad')
                )

                # Organizar estadísticas por hora
                estadisticas_dict = {e['hora']: e for e in estadisticas}

                # Función para procesar los días
                def procesar_dia(dia):
                    suma_baja = suma_media = suma_alta = cantidad_inversor = 0
                    for hora in range(1, 25):  # Rango de horas de 08 a 22
                        hora_str = f'H{hora}'
                        cantidad = producciones_dict.get((dia, hora_str))
                        if cantidad is None:
                            continue

                        estadisticas_hora = estadisticas_dict.get(hora_str)
                        if not estadisticas_hora:
                            continue

                        # Calcular percepción y pertenencia
                        TLbaja, TLmedia, TLalta = obtenerPercepcionComputacionalPrimerGrado(
                            estadisticas_hora['cantidad_minima'], estadisticas_hora['cantidad_maxima']
                        )
                        pertenencia_baja = calcular_pertenencia_baja(cantidad, TLbaja)
                        pertenencia_media = calcular_pertenencia_media(cantidad, TLmedia)
                        pertenencia_alta = calcular_pertenencia_alta(cantidad, TLalta)

                        # Acumular las pertenencias para el inversor
                        suma_baja += pertenencia_baja
                        suma_media += pertenencia_media
                        suma_alta += pertenencia_alta
                        cantidad_inversor += 1

                    return cantidad_inversor, suma_baja, suma_media, suma_alta

                # Procesar días en paralelo
                with ThreadPoolExecutor() as executor:
                    resultados = list(executor.map(procesar_dia, range(1, 32)))  # Procesar días 1 a 31

                # Sumar los resultados por cada inversor
                cantidad_inversor, suma_baja, suma_media, suma_alta = map(sum, zip(*resultados))

                cantidad_r += cantidad_inversor
                suma_mala += suma_baja
                suma_normal += suma_media
                suma_excelente += suma_alta

                # Calcular las descripciones lingüísticas para el inversor
                if cantidad_inversor > 0:
                    inversor_info = {
                        'inversor_id': inversor.id,
                        'inversor_nombre': inversor.nombre,
                        'cantidad_r_inversor': cantidad_inversor,
                        'suma_baja_inversor': suma_baja,
                        'DL_baja_inversor': obtenerClasificacionDescripcionLinguistica(suma_baja / cantidad_inversor, "BAJA"),
                        'suma_media_inversor': suma_media,
                        'DL_media_inversor': obtenerClasificacionDescripcionLinguistica(suma_media / cantidad_inversor, "MEDIA"),
                        'suma_alta_inversor': suma_alta,
                        'DL_alta_inversor': obtenerClasificacionDescripcionLinguistica(suma_alta / cantidad_inversor, "ALTA")
                    }
                    inversores_info.append(inversor_info)

            # Responder con los resultados para la estación y los inversores
            return Response({
                "estacion": estacion.nombre,
                "cantidad_r": cantidad_r,
                "suma_mala": suma_mala,
                "DL_mala": obtenerClasificacionDescripcionLinguistica(suma_mala / cantidad_r, "MALA"),
                "suma_normal": suma_normal,
                "DL_normal": obtenerClasificacionDescripcionLinguistica(suma_normal / cantidad_r, "NORMAL"),
                "suma_excelente": suma_excelente,
                "DL_excelente": obtenerClasificacionDescripcionLinguistica(suma_excelente / cantidad_r, "EXCELENTE"),
                "inversores_info": inversores_info  # Descripciones de cada inversor
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


