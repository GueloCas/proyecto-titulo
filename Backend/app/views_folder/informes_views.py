from app.models import Inversor, Produccion, Estacion
from rest_framework import status 
from rest_framework.views import APIView 
from rest_framework.response import Response
from app.utils.functions import obtenerPercepcionComputacionalPrimerGrado, calcular_pertenencia_baja, calcular_pertenencia_media, calcular_pertenencia_alta, obtenerClasificacionDescripcionLinguistica
from django.db.models import Min, Max, Sum
import calendar
from rest_framework.authtoken.models import Token 

class GenerarInformeInversorView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')  # O usa 'Authorization' en headers
        
        if not token:
            return Response({"detail": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        user_token = Token.objects.get(key=token)
        user = user_token.user  # Obtén el usuario asociado con el token

        # Validar los parámetros
        parametros_requeridos = ['inversor', 'anio', 'mes']
        for param in parametros_requeridos:
            if not request.query_params.get(param):
                return Response({"error": f"Se requiere el parámetro '{param}'"}, status=status.HTTP_400_BAD_REQUEST)

        inversor_id = request.query_params['inversor']
        anio = request.query_params['anio']
        mes = request.query_params['mes']

        try:
            inversor = Inversor.objects.get(pk=inversor_id)

            if inversor.estacion.usuario != user:
                return Response({"error": "No tienes permiso para acceder a este inversor"}, status=status.HTTP_403_FORBIDDEN)

            num_dias_mes = calendar.monthrange(int(anio), int(mes))[1] 

            # Producción diaria y total
            produccion_diaria = [
                (dia, inversor.obtener_cantidad_total_diaria(anio, mes, dia))
                for dia in range(1, num_dias_mes + 1)
            ]
            produccion_total_mes = sum(p[1] for p in produccion_diaria)
            produccion_diaria_ordenada = sorted(produccion_diaria, key=lambda x: x[1], reverse=True)

            # Estadísticas por hora y pertenencias lingüísticas
            cantidad_r, suma_baja, suma_media, suma_alta = 0, 0, 0, 0
            for dia, produccion in produccion_diaria:
                if produccion is None:
                    continue
                for hora in range(0, 24):
                    estadisticas_hora = inversor.obtener_MinMaxProm_producciones_hora(anio, mes, f'H{hora}').first()
                    if not estadisticas_hora:
                        continue
                    TLbaja, TLmedia, TLalta = obtenerPercepcionComputacionalPrimerGrado(
                        estadisticas_hora['cantidad_minima'],
                        estadisticas_hora['cantidad_maxima']
                    )
                    cantidad = Produccion.objects.filter(
                        inversor=inversor, anio=anio, mes=mes, dia=dia, hora=f'H{hora}'
                    ).aggregate(Sum('cantidad'))['cantidad__sum'] or 0

                    suma_baja += calcular_pertenencia_baja(cantidad, TLbaja)
                    suma_media += calcular_pertenencia_media(cantidad, TLmedia)
                    suma_alta += calcular_pertenencia_alta(cantidad, TLalta)
                    cantidad_r += 1

            DL_baja = obtenerClasificacionDescripcionLinguistica(suma_baja / cantidad_r, "baja")
            DL_media = obtenerClasificacionDescripcionLinguistica(suma_media / cantidad_r, "media")
            DL_alta = obtenerClasificacionDescripcionLinguistica(suma_alta / cantidad_r, "alta")

            # Producción comparativa con otros inversores
            produccion_totales = [
                (
                    inv.nombre,
                    sum(inv.obtener_cantidad_total_diaria(anio, mes, dia) for dia in range(1, num_dias_mes + 1))
                )
                for inv in Inversor.objects.filter(estacion=inversor.estacion)
            ]
            produccion_totales_ordenados = sorted(produccion_totales, key=lambda x: x[1], reverse=True)
            posicion_inversor = next(
                (index + 1 for index, (nombre, _) in enumerate(produccion_totales_ordenados) if nombre == inversor.nombre),
                None
            )

            estadisticas = inversor.obtener_MinMaxProm_producciones(anio, mes)

            return Response({
                "inversor": inversor.nombre,
                "estacion": inversor.estacion.nombre,
                "produccion_total_mes": produccion_total_mes,
                "promedio_diario": round(produccion_total_mes / len(produccion_diaria_ordenada), 2),
                "produccion_diaria": produccion_diaria_ordenada,
                "estadisticas": estadisticas,
                "posicion_en_top": posicion_inversor,
                "total_inversores": len(produccion_totales_ordenados),
                "todos_inversores": produccion_totales_ordenados,
                "descripcion_linguistica": {
                    "porcentaje_baja": round((suma_baja / cantidad_r) * 100, 2),
                    "DL_baja": DL_baja,
                    "porcentaje_media": round((suma_media / cantidad_r) * 100, 2),
                    "DL_media": DL_media,
                    "porcentaje_alta": round((suma_alta / cantidad_r) * 100, 2),
                    "DL_alta": DL_alta,
                },
            })

        except Inversor.DoesNotExist:
            return Response({"error": "Inversor no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GenerarInformeEstacionView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')  # O usa 'Authorization' en headers
        
        if not token:
            return Response({"detail": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        user_token = Token.objects.get(key=token)
        user = user_token.user  # Obtén el usuario asociado con el token

        estacion_id = request.query_params.get('estacion')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')

        if not estacion_id:
            return Response({"error": "Se requiere el parámetro 'estacion_id'"}, status=status.HTTP_400_BAD_REQUEST)
        if not anio:
            return Response({"error": "Se requiere el parámetro 'anio'"}, status=status.HTTP_400_BAD_REQUEST)
        if not mes:
            return Response({"error": "Se requiere el parámetro 'mes'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            estacion = Estacion.objects.get(pk=estacion_id)

            if estacion.usuario != user:
                return Response({"error": "No tienes permiso para acceder a esta estación"}, status=status.HTTP_403_FORBIDDEN)

            inversores = Inversor.objects.filter(estacion=estacion)

            num_dias_mes = calendar.monthrange(int(anio), int(mes))[1] 

            total_mensual_estacion = 0
            produccion_diaria_estacion = {dia: 0 for dia in range(1, num_dias_mes + 1)}
            descripciones_inversores = []
            produccion_mensual_inversores = []  # Lista separada para la suma mensual por inversor

            # Variables para las percepciones
            cantidad_r = 0
            suma_baja = suma_media = suma_alta = 0

            for inversor in inversores:
                total_mensual_inversor = 0
                producciones = Produccion.objects.filter(
                    inversor=inversor, anio=anio, mes=mes
                ).values('dia', 'hora', 'cantidad')

                # Agrupar estadísticas por hora
                estadisticas_horas = producciones.values('hora').annotate(
                    cantidad_minima=Min('cantidad'),
                    cantidad_maxima=Max('cantidad')
                )
                estadisticas_horas_dict = {e['hora']: e for e in estadisticas_horas}

                suma_baja_inversor = suma_media_inversor = suma_alta_inversor = 0
                cantidad_horas_inversor = 0

                for produccion in producciones:
                    dia, hora, cantidad = produccion['dia'], produccion['hora'], produccion['cantidad']
                    estadisticas_hora = estadisticas_horas_dict.get(hora)

                    if not estadisticas_hora:
                        continue

                    # Calcular términos lingüísticos para esta hora
                    TLbaja, TLmedia, TLalta = obtenerPercepcionComputacionalPrimerGrado(
                        estadisticas_hora['cantidad_minima'], estadisticas_hora['cantidad_maxima']
                    )

                    # Calcular pertenencias
                    pertenencia_baja = calcular_pertenencia_baja(cantidad, TLbaja)
                    pertenencia_media = calcular_pertenencia_media(cantidad, TLmedia)
                    pertenencia_alta = calcular_pertenencia_alta(cantidad, TLalta)

                    suma_baja_inversor += pertenencia_baja
                    suma_media_inversor += pertenencia_media
                    suma_alta_inversor += pertenencia_alta
                    cantidad_horas_inversor += 1

                    # Sumar la producción diaria a nivel de estación e inversor
                    produccion_diaria_estacion[dia] += cantidad
                    total_mensual_inversor += cantidad

                # Acumular estadísticas a nivel de estación
                cantidad_r += cantidad_horas_inversor
                suma_baja += suma_baja_inversor
                suma_media += suma_media_inversor
                suma_alta += suma_alta_inversor

                # Agregar suma mensual a la lista de producción mensual por inversor
                produccion_mensual_inversores.append({
                    "inversor_nombre": inversor.nombre,
                    "total_mensual_inversor": total_mensual_inversor
                })

                # Registrar descripciones del inversor
                if cantidad_horas_inversor > 0:
                    descripciones_inversores.append({
                        "inversor_id": inversor.id,
                        "inversor_nombre": inversor.nombre,
                        "porcentaje_baja": round((suma_baja_inversor / cantidad_horas_inversor) * 100, 2),
                        "DL_baja": obtenerClasificacionDescripcionLinguistica(
                            suma_baja_inversor / cantidad_horas_inversor, "BAJA"
                        ),
                        "porcentaje_media": round((suma_media_inversor / cantidad_horas_inversor) * 100, 2),
                        "DL_media": obtenerClasificacionDescripcionLinguistica(
                            suma_media_inversor / cantidad_horas_inversor, "MEDIA"
                        ),
                        "porcentaje_alta": round((suma_alta_inversor / cantidad_horas_inversor) * 100, 2),
                        "DL_alta": obtenerClasificacionDescripcionLinguistica(
                            suma_alta_inversor / cantidad_horas_inversor, "ALTA"
                        ),
                    })

                total_mensual_estacion += total_mensual_inversor

            # Ordenar la lista de producción mensual de mayor a menor
            produccion_mensual_inversores = sorted(
                produccion_mensual_inversores,
                key=lambda x: x["total_mensual_inversor"],
                reverse=True
            )

            # Preparar respuesta
            produccion_diaria_ordenada = sorted(
                [{"dia": dia, "produccion": produccion_diaria_estacion[dia]}
                 for dia in range(1, num_dias_mes + 1) if produccion_diaria_estacion[dia] > 0],
                key=lambda x: x["produccion"], reverse=True
            )

            return Response({
                "estacion": {
                    "nombre": estacion.nombre,
                    "total_mensual": total_mensual_estacion,
                    "promedio_inversores": round(total_mensual_estacion / len(inversores), 2),
                    "promedio_diario": round(total_mensual_estacion / len(produccion_diaria_ordenada), 2),
                    "produccion_diaria": produccion_diaria_ordenada,
                },
                "produccion_mensual_inversores": produccion_mensual_inversores,  # Nueva lista separada
                "descripciones_linguisticas": {
                    "cantidad_r": cantidad_r,
                    "DL_mala": obtenerClasificacionDescripcionLinguistica(
                        suma_baja / cantidad_r if cantidad_r > 0 else 0, "MALA"
                    ),
                    "porcentaje_baja": round((suma_baja / cantidad_r) * 100, 2),
                    "DL_normal": obtenerClasificacionDescripcionLinguistica(
                        suma_media / cantidad_r if cantidad_r > 0 else 0, "NORMAL"
                    ),
                    "porcentaje_normal": round((suma_media / cantidad_r) * 100, 2),
                    "DL_excelente": obtenerClasificacionDescripcionLinguistica(
                        suma_alta / cantidad_r if cantidad_r > 0 else 0, "EXCELENTE"
                    ),
                    "porcentaje_excelente": round((suma_alta / cantidad_r) * 100, 2),
                    "inversores": descripciones_inversores
                }
            }, status=status.HTTP_200_OK)

        except Estacion.DoesNotExist:
            return Response({"error": "Estación no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
