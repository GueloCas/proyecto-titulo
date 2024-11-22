from app.models import Inversor, Produccion, Estacion
from rest_framework import status 
from rest_framework.views import APIView 
from rest_framework.response import Response 

from app.utils.functions import calcular_pertenencia_baja, calcular_pertenencia_media, calcular_pertenencia_alta, obtenerPercepcionComputacionalPrimerGrado, obtenerPercepcionComputacionalSegundoGrado

class ObtenerPercepcionesSegundoGradoDiaHoraView(APIView): 
    def get(self, request, *args, **kwargs):
        # Obtener el día y la hora de los parámetros de la solicitud
        id_estacion = request.query_params.get('estacion')
        dia = request.query_params.get('dia')
        dia_int = int(dia) if isinstance(dia, str) else dia
        hora = request.query_params.get('hora')
        hora_formateada = f"H{hora}" 

        if not dia:
            return Response({"error": "Se requiere el parámetro 'dia'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            mes_actual = "Aug"  # Nombre del mes en inglés
            anio_actual = 2022
            dia_formateado = f"{dia_int:02d}-{mes_actual}-{anio_actual}"

            # Lista para almacenar las percepciones de cada inversor
            percepciones = []
            
            inversores = Inversor.objects.filter(estacion_id=id_estacion)

            for inversor in inversores:
                # Filtrar la producción para el día y hora especificados
                produccion = Produccion.objects.filter(Dia=dia_formateado, inversor=inversor, Hora=hora_formateada).values('cantidad').first()
                
                # Validar si hay producción en ese día y hora
                if produccion:
                    cantidad = produccion['cantidad']
                    
                    # Obtener las estadísticas de la hora para calcular los términos lingüísticos
                    estadisticas_hora = inversor.obtener_MinMaxProm_producciones_hora(hora_formateada).first()
                    if estadisticas_hora:
                        TLbaja, TLmedia, TLalta = obtenerPercepcionComputacionalPrimerGrado(
                            estadisticas_hora['cantidad_minima'], 
                            estadisticas_hora['cantidad_maxima']
                        )

                        # Calcular las pertenencias
                        pertenencia_baja = calcular_pertenencia_baja(cantidad, TLbaja)
                        pertenencia_media = calcular_pertenencia_media(cantidad, TLmedia)
                        pertenencia_alta = calcular_pertenencia_alta(cantidad, TLalta)

                        # Agregar los datos al diccionario de percepciones
                        percepciones.append({
                            'inversor': inversor.nombre,
                            'pertenencia_baja': pertenencia_baja,
                            'pertenencia_media': pertenencia_media,
                            'pertenencia_alta': pertenencia_alta
                        })
            
            percepcionesSegundoGrado = obtenerPercepcionComputacionalSegundoGrado(percepciones)

            # Preparar los datos para la respuesta
            response_data = {
                'percepciones_segundo_grado': percepcionesSegundoGrado
            }
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ObtenerPercepcionesSegundoGradoDiaView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el día de los parámetros de la solicitud
        id_estacion = request.query_params.get('estacion')
        dia = request.query_params.get('dia')
        dia_int = int(dia) if isinstance(dia, str) else dia

        if not dia:
            return Response({"error": "Se requiere el parámetro 'dia'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            mes_actual = "Aug"  # Nombre del mes en inglés
            anio_actual = 2022
            dia_formateado = f"{dia_int:02d}-{mes_actual}-{anio_actual}"
            print(dia_formateado)

            # Lista para almacenar las percepciones por hora
            percepciones_diarias = []

            inversores = Inversor.objects.filter(estacion_id=id_estacion)

            # Recorrer cada hora desde las 8 hasta las 22
            for hora in range(8, 23):
                hora_str = f'H{hora}'
                percepciones = []  # Lista para almacenar las percepciones de cada inversor en la hora actual
                produccion_encontrada = False  # Bandera para verificar si se encontró producción en la hora actual

                for inversor in inversores:
                    # Filtrar la producción para el día y hora especificados
                    produccion = Produccion.objects.filter(Dia=dia_formateado, inversor=inversor, Hora=hora_str).values('cantidad').first()
                    
                    # Validar si hay producción en ese día y hora para el inversor actual
                    if produccion:
                        produccion_encontrada = True
                        cantidad = produccion['cantidad']
                        
                        # Obtener las estadísticas de la hora para calcular los términos lingüísticos
                        estadisticas_hora = inversor.obtener_MinMaxProm_producciones_hora(hora_str).first()
                        if estadisticas_hora:
                            TLbaja, TLmedia, TLalta = obtenerPercepcionComputacionalPrimerGrado(
                                estadisticas_hora['cantidad_minima'], 
                                estadisticas_hora['cantidad_maxima']
                            )

                            # Calcular las pertenencias
                            pertenencia_baja = calcular_pertenencia_baja(cantidad, TLbaja)
                            pertenencia_media = calcular_pertenencia_media(cantidad, TLmedia)
                            pertenencia_alta = calcular_pertenencia_alta(cantidad, TLalta)

                            # Agregar los datos al diccionario de percepciones
                            percepciones.append({
                                'inversor': inversor.nombre,
                                'pertenencia_baja': pertenencia_baja,
                                'pertenencia_media': pertenencia_media,
                                'pertenencia_alta': pertenencia_alta
                            })

                # Si se encontró producción en al menos un inversor para la hora actual, calcula el segundo grado y agrega a la lista diaria
                if produccion_encontrada:
                    percepciones_segundo_grado = obtenerPercepcionComputacionalSegundoGrado(percepciones)
                    percepciones_diarias.append({
                        'hora': hora,
                        'percepciones_segundo_grado': percepciones_segundo_grado
                    })

            # Preparar los datos para la respuesta
            return Response(percepciones_diarias, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ObtenerPercepcionesPrimerGradoDiaView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ID del inversor de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor')
        dia = request.query_params.get('dia')
        dia_int = int(dia) if isinstance(dia, str) else dia

        print(f"inversor_id: {inversor_id}")
        
        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            mes_actual = "Aug"  # Nombre del mes en inglés
            anio_actual = 2022
            dia_formateado = f"{dia_int:02d}-{mes_actual}-{anio_actual}"

            # Obtener el inversor
            inversor = Inversor.objects.get(pk=inversor_id)

            TLlist = []
            
            for hora in range(1,25):
                produccion = Produccion.objects.filter(Dia=dia_formateado, inversor=inversor, Hora=f"H{hora}").first()
                
                if produccion:
                    estadisticas_hora = inversor.obtener_MinMaxProm_producciones_hora(f"H{hora}").first()

                    if estadisticas_hora:
                        # Obtener los términos lingüísticos basados en los valores mínimos y máximos de esa hora
                        TLbaja, TLmedia, TLalta = obtenerPercepcionComputacionalPrimerGrado(
                            estadisticas_hora['cantidad_minima'], 
                            estadisticas_hora['cantidad_maxima']
                        )
                        
                        # Calcular los grados de pertenencia
                        pertenencia_baja = calcular_pertenencia_baja(produccion.cantidad, TLbaja)
                        pertenencia_media = calcular_pertenencia_media(produccion.cantidad, TLmedia)
                        pertenencia_alta = calcular_pertenencia_alta(produccion.cantidad, TLalta)

                        # Agregar los datos al listado final
                        TLlist.append({
                            'Dia': produccion.Dia,
                            'Hora': produccion.Hora,
                            'cantidad': produccion.cantidad,
                            'pertenencia': {
                                'baja': round(pertenencia_baja, 2),
                                'media': round(pertenencia_media, 2),
                                'alta': round(pertenencia_alta, 2)
                            }
                        })
                    else:
                        print(f"No se encontraron estadísticas para la hora: {produccion.Hora}")

            # Iterar sobre cada producción
            
            return Response(TLlist, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class ObtenerPercepcionesPrimerGradoHoraView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ID del inversor de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor')
        hora = request.query_params.get('hora')
        hora_formateada = f"H{hora}"

        print(f"inversor_id: {inversor_id}")
        
        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtener el inversor
            inversor = Inversor.objects.get(pk=inversor_id)
            
            # Obtener las estadísticas por hora del inversor
            estadisticas_hora = inversor.obtener_MinMaxProm_producciones_hora(hora_formateada).first()
            
            # Obtener las producciones del inversor
            producciones = inversor.obtener_producciones_hora(hora_formateada)
            
            TLlist = []

            # Iterar sobre cada producción
            for produccion in producciones:
                # Verificar si se encontraron estadísticas para la hora actual
                if estadisticas_hora:
                    # Obtener los términos lingüísticos basados en los valores mínimos y máximos de esa hora
                    TLbaja, TLmedia, TLalta = obtenerPercepcionComputacionalPrimerGrado(
                        estadisticas_hora['cantidad_minima'], 
                        estadisticas_hora['cantidad_maxima']
                    )
                    
                    # Calcular los grados de pertenencia
                    pertenencia_baja = calcular_pertenencia_baja(produccion.cantidad, TLbaja)
                    pertenencia_media = calcular_pertenencia_media(produccion.cantidad, TLmedia)
                    pertenencia_alta = calcular_pertenencia_alta(produccion.cantidad, TLalta)

                    # Agregar los datos al listado final
                    TLlist.append({
                        'Dia': produccion.Dia,
                        'Hora': produccion.Hora,
                        'cantidad': produccion.cantidad,
                        'pertenencia': {
                            'baja': round(pertenencia_baja, 2),
                            'media': round(pertenencia_media, 2),
                            'alta': round(pertenencia_alta, 2)
                        }
                    })
                else:
                    print(f"No se encontraron estadísticas para la hora: {produccion.Hora}")
            
            return Response(TLlist, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
