from app.models import Inversor, Produccion, Estacion
from rest_framework import status 
from rest_framework.views import APIView 
from rest_framework.response import Response
from concurrent.futures import ThreadPoolExecutor
from rest_framework.authtoken.models import Token 

from app.utils.functions import calcular_pertenencia_baja, calcular_pertenencia_media, calcular_pertenencia_alta, obtenerPercepcionComputacionalPrimerGrado, obtenerPercepcionComputacionalSegundoGrado

class ObtenerPercepcionesSegundoGradoDiaHoraView(APIView): 
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')  # O usa 'Authorization' en headers
        
        if not token:
            return Response({"detail": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        user_token = Token.objects.get(key=token)
        user = user_token.user  # Obtén el usuario asociado con el token

        # Obtener el día y la hora de los parámetros de la solicitud
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
        if not hora:
            return Response({"error": "Se requiere el parámetro 'hora'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            estacion = Estacion.objects.get(pk=id_estacion)

            if estacion.usuario != user:
                return Response({"error": "No tienes permiso para acceder a esta estación"}, status=status.HTTP_403_FORBIDDEN)

            # Lista para almacenar las percepciones de cada inversor
            percepciones = []
            
            inversores = Inversor.objects.filter(estacion_id=estacion)

            for inversor in inversores:
                # Filtrar la producción para el día y hora especificados
                produccion = Produccion.objects.filter(inversor=inversor, anio=anio, mes=mes, dia=dia, hora=hora_formateada).values('cantidad').first()
                
                # Validar si hay producción en ese día y hora
                if produccion:
                    cantidad = produccion['cantidad']
                    
                    # Obtener las estadísticas de la hora para calcular los términos lingüísticos
                    estadisticas_hora = inversor.obtener_MinMaxProm_producciones_hora(anio, mes, hora_formateada).first()
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
                'estacion': estacion.nombre,
                'percepciones': percepcionesSegundoGrado
            }
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ObtenerPercepcionesSegundoGradoDiaView(APIView):
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

            def procesar_hora(hora):
                hora_str = f'H{hora}'
                percepciones = []
                produccion_encontrada = False

                for inversor in inversores:
                    produccion = Produccion.objects.filter(
                        inversor=inversor, anio=anio, mes=mes, dia=dia, hora=hora_str
                    ).values('cantidad').first()

                    if produccion:
                        produccion_encontrada = True
                        cantidad = produccion['cantidad']
                        
                        estadisticas_hora = inversor.obtener_MinMaxProm_producciones_hora(anio, mes, hora_str).first()
                        if estadisticas_hora:
                            TLbaja, TLmedia, TLalta = obtenerPercepcionComputacionalPrimerGrado(
                                estadisticas_hora['cantidad_minima'],
                                estadisticas_hora['cantidad_maxima']
                            )

                            pertenencia_baja = calcular_pertenencia_baja(cantidad, TLbaja)
                            pertenencia_media = calcular_pertenencia_media(cantidad, TLmedia)
                            pertenencia_alta = calcular_pertenencia_alta(cantidad, TLalta)

                            percepciones.append({
                                'inversor': inversor.nombre,
                                'pertenencia_baja': pertenencia_baja,
                                'pertenencia_media': pertenencia_media,
                                'pertenencia_alta': pertenencia_alta
                            })

                if produccion_encontrada:
                    percepciones_segundo_grado = obtenerPercepcionComputacionalSegundoGrado(percepciones)
                    return {
                        'hora': hora,
                        'percepciones_segundo_grado': percepciones_segundo_grado
                    }
                return None

            # Usar ThreadPoolExecutor para paralelizar el procesamiento por hora
            with ThreadPoolExecutor() as executor:
                resultados = list(executor.map(procesar_hora, range(0, 24)))

            # Filtrar resultados no nulos
            percepciones_diarias = [resultado for resultado in resultados if resultado is not None]

            return Response({
                'estacion': estacion.nombre,
                'percepciones': percepciones_diarias
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ObtenerPercepcionesPrimerGradoDiaView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')  # O usa 'Authorization' en headers
        
        if not token:
            return Response({"detail": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        user_token = Token.objects.get(key=token)
        user = user_token.user  # Obtén el usuario asociado con el token

        # Obtener el ID del inversor de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')
        dia = request.query_params.get('dia')
        
        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        if not anio:
            return Response({"error": "Se requiere el parámetro 'anio'"}, status=status.HTTP_400_BAD_REQUEST)
        if not mes:
            return Response({"error": "Se requiere el parámetro 'mes'"}, status=status.HTTP_400_BAD_REQUEST)
        if not dia:
            return Response({"error": "Se requiere el parámetro 'dia'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtener el inversor
            inversor = Inversor.objects.get(pk=inversor_id)

            if inversor.estacion.usuario != user:
                return Response({"error": "No tienes permiso para acceder a este inversor"}, status=status.HTTP_403_FORBIDDEN)

            TLlist = []
            
            for hora in range(0,24):
                hora_str = f'H{hora}'
                produccion = Produccion.objects.filter(inversor=inversor, anio=anio, mes=mes, dia=dia, hora=hora_str).first()
                
                if produccion:
                    estadisticas_hora = inversor.obtener_MinMaxProm_producciones_hora(anio, mes, hora_str).first()
                    print (estadisticas_hora)

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
                            'Dia': produccion.fecha,
                            'Hora': produccion.hora,
                            'cantidad': produccion.cantidad,
                            'pertenencia': {
                                'baja': round(pertenencia_baja, 2),
                                'media': round(pertenencia_media, 2),
                                'alta': round(pertenencia_alta, 2)
                            }
                        })
                    else:
                        print(f"No se encontraron estadísticas para la hora: {produccion.hora}")

            # Iterar sobre cada producción
            
            return Response({
                'inversor': inversor.nombre,
                'percepciones': TLlist
            }, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class ObtenerPercepcionesPrimerGradoHoraView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')  # O usa 'Authorization' en headers
        
        if not token:
            return Response({"detail": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        user_token = Token.objects.get(key=token)
        user = user_token.user  # Obtén el usuario asociado con el token

        # Obtener el ID del inversor de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')
        hora = request.query_params.get('hora')
        hora_formateada = f"H{hora}"
        
        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        if not anio:
            return Response({"error": "Se requiere el parámetro 'anio'"}, status=status.HTTP_400_BAD_REQUEST)
        if not mes:
            return Response({"error": "Se requiere el parámetro 'mes'"}, status=status.HTTP_400_BAD_REQUEST)
        if not hora:
            return Response({"error": "Se requiere el parámetro 'hora'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Obtener el inversor
            inversor = Inversor.objects.get(pk=inversor_id)

            if inversor.estacion.usuario != user:
                return Response({"error": "No tienes permiso para acceder a este inversor"}, status=status.HTTP_403_FORBIDDEN)

            
            # Obtener las estadísticas por hora del inversor
            estadisticas_hora = inversor.obtener_MinMaxProm_producciones_hora(anio, mes, hora_formateada).first()
            
            # Obtener las producciones del inversor
            producciones = inversor.obtener_producciones_hora(anio, mes, hora_formateada)
            
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
                        'Dia': produccion.fecha,
                        'Hora': produccion.hora,
                        'cantidad': produccion.cantidad,
                        'pertenencia': {
                            'baja': round(pertenencia_baja, 2),
                            'media': round(pertenencia_media, 2),
                            'alta': round(pertenencia_alta, 2)
                        }
                    })
                else:
                    print(f"No se encontraron estadísticas para la hora: {produccion.hora}")
            
            return Response({
                'inversor': inversor.nombre,
                'percepciones': TLlist
            }, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        


           