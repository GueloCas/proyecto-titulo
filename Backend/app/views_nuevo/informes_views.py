from app.models import Inversor, Produccion, Estacion
from rest_framework import status 
from rest_framework.views import APIView 
from rest_framework.response import Response
from app.utils.functions import obtenerPercepcionComputacionalPrimerGrado, calcular_pertenencia_baja, calcular_pertenencia_media, calcular_pertenencia_alta, obtenerClasificacionDescripcionLinguistica

class GenerarInformeInversorView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ID del inversor de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')

        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        if not anio:
            return Response({"error": "Se requiere el parámetro 'anio'"}, status=status.HTTP_400_BAD_REQUEST)
        if not mes:
            return Response({"error": "Se requiere el parámetro 'mes'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try: 
            # Obtener el inversor
            inversor = Inversor.objects.get(pk=inversor_id)

            produccion_total_mes = 0
            produccion_diaria = []

            cantidad_r = 0
            suma_baja = 0
            suma_media = 0
            suma_alta = 0

            for dia in range(1, 32):
                produccion = inversor.obtener_cantidad_total_diaria(anio, mes, dia)
                produccion_diaria.append((dia, produccion))
                produccion_total_mes += produccion

                # Cálculo de descripciones lingüísticas para cada día
                for hora in range(8, 23):  # Ciclo por horas del día
                    hora_str = f'H{hora}'

                    produccion_hora = Produccion.objects.filter(
                        inversor=inversor, anio=anio, mes=mes, dia=dia, hora=hora_str
                    ).values('cantidad').first()

                    if not produccion_hora:
                        continue  # Si no hay producción, pasar a la siguiente hora

                    cantidad = produccion_hora['cantidad']

                    # Obtener estadísticas para calcular términos lingüísticos
                    estadisticas_hora = inversor.obtener_MinMaxProm_producciones_hora(anio, mes, hora_str).first()
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

                    # Acumular las pertenencias para las descripciones lingüísticas
                    cantidad_r += 1
                    suma_baja += pertenencia_baja
                    suma_media += pertenencia_media
                    suma_alta += pertenencia_alta

            # Ordenar los días por producción
            produccion_diaria_ordenada = sorted(produccion_diaria, key=lambda x: x[1])

            # Obtener los 3 días con mayor y menor producción
            dias_mayor_produccion = produccion_diaria_ordenada[-3:]
            dias_menor_produccion = produccion_diaria_ordenada[:3]

            # Calcular el promedio diario
            promedio_diario = produccion_total_mes / 31

            # Comparar la producción total con los demás inversores
            # Obtener la producción total de todos los inversores
            todos_inversores = Inversor.objects.filter(estacion=inversor.estacion)
            produccion_totales = []

            for inv in todos_inversores:
                produccion_total_inversor = 0
                for dia in range(1, 32):
                    produccion_total_inversor += inv.obtener_cantidad_total_diaria(anio, mes, dia)
                produccion_totales.append((inv.nombre, produccion_total_inversor))

            # Ordenar los inversores por producción total
            produccion_totales_ordenados = sorted(produccion_totales, key=lambda x: x[1], reverse=True)

            # Encontrar la posición del inversor en la lista ordenada
            posicion_inversor = next((index for index, (nombre, _) in enumerate(produccion_totales_ordenados) if nombre == inversor.nombre), None) + 1

            # Calcular las descripciones lingüísticas
            DL_baja = obtenerClasificacionDescripcionLinguistica(suma_baja / cantidad_r, "baja")
            DL_media = obtenerClasificacionDescripcionLinguistica(suma_media / cantidad_r, "media")
            DL_alta = obtenerClasificacionDescripcionLinguistica(suma_alta / cantidad_r, "alta")

            estadisticas = inversor.obtener_MinMaxProm_producciones(anio, mes)

            return Response({
                "inversor": inversor.nombre,
                "estacion": inversor.estacion.nombre,
                "produccion_total_mes": produccion_total_mes,
                "promedio_diario": promedio_diario,
                "dias_mayor_produccion": dias_mayor_produccion,
                "dias_menor_produccion": dias_menor_produccion,
                "estadisticas": estadisticas,
                "posicion_en_top": posicion_inversor,
                "total_inversores": len(produccion_totales_ordenados),
                "todos_inversores": produccion_totales_ordenados,  # Lista de inversores con su producción total
                "descripcion_linguistica": {
                    "suma_baja": suma_baja,
                    "DL_baja": DL_baja,
                    "suma_media": suma_media,
                    "DL_media": DL_media,
                    "suma_alta": suma_alta,
                    "DL_alta": DL_alta
                }
            })
        
        except Inversor.DoesNotExist:
            return Response({"error": "Inversor no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        

