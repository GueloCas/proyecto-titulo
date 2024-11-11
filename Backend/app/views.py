from .models import Inversor, Produccion
from django.contrib.auth.models import User
from .serializer import InversorSerializer, ProduccionSerializer, UserSerializer
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.db.models import IntegerField, Min, Max, Avg
from django.db.models.functions import Cast, Substr
import pandas as pd

from django.shortcuts import get_object_or_404

from app.utils.functions import calcular_pertenencia_baja, calcular_pertenencia_media, calcular_pertenencia_alta, obtenerPercepcionComputacionalPrimerGrado, obtenerPercepcionComputacionalSegundoGrado

class InversorViewSet(viewsets.ModelViewSet):
    queryset = Inversor.objects.all()
    serializer_class = InversorSerializer

class ProduccionViewSet(viewsets.ModelViewSet):
    queryset = Produccion.objects.all()
    serializer_class = ProduccionSerializer

class ExcelUploadView(APIView):
    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        
        if not file:
            return Response({"error": "No se envió ningún archivo"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Lee el archivo Excel usando pandas
            df = pd.read_excel(file, header=None)

            producciones = []
            
            # Recorre las columnas de la hoja de Excel
            for col_index in range(1, len(df.columns)):
                # Obtener el nombre del inversor (primera casilla de la columna)
                nombre_inversor = df.iloc[0, col_index]  # Primer valor de la columna
                print(f"Nombre del Inversor en Columna {col_index + 1}: {nombre_inversor}")

                inversor = Inversor.objects.create(nombre=nombre_inversor)
                print(f"Inversor creado con ID: {inversor.id}")
                
                # Iterar hacia abajo en la columna, comenzando desde la fila 1
                for row_index in range(1, len(df)):
                    valor = df.iloc[row_index, col_index]  # Obtener el valor en la fila actual

                    if pd.notna(valor): # Si el valor no es nulo
                        periodo = df.iloc[row_index, 0] # Obtener el periodo de tiempo
                        fecha, hora = periodo.split(', ') # Separar la fecha y la hora
                        print(f"Fila {row_index}, inversor: {nombre_inversor}, fecha: {fecha}, hora: {hora}, valor: {valor}")

                        produccion = Produccion( # Crear un objeto Produccion
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
        
class InversorProduccionView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ID del inversor de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor_id')
        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtener el inversor por ID
            inversor = Inversor.objects.get(pk=inversor_id)

            # Agrupar las producciones por hora y calcular estadísticas agregadas
            estadisticas_por_hora = inversor.obtener_MinMaxProm_producciones()

            producciones = inversor.obtener_producciones_ordenHora()
            
            serializer = ProduccionSerializer(producciones, many=True)

            # Crear respuesta
            response_data = {
                'nombre_inversor': inversor.nombre,  # Nombre del inversor
                'producciones': serializer.data,  # Producciones completas
                'estadisticas_por_hora': list(estadisticas_por_hora)  # Estadísticas agrupadas por hora
            }

            return Response(response_data, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class InversorProduccionEstadisticasView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ID del inversor de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor_id')
        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtener el inversor por ID
            inversor = Inversor.objects.get(pk=inversor_id)

            # Agrupar las producciones por hora y calcular estadísticas agregadas
            estadisticas_por_hora = inversor.obtener_MinMaxProm_producciones()

            # Serializar producciones completas
            producciones = inversor.obtener_producciones()

            serializer = ProduccionSerializer(producciones, many=True)

            # Crear respuesta
            response_data = {
                'nombre_inversor': inversor.nombre,  # Nombre del inversor
                'producciones': serializer.data,  # Producciones completas
                'estadisticas_por_hora': list(estadisticas_por_hora)  # Estadísticas agrupadas por hora
            }

            return Response(response_data, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class InversorProduccionHoraView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ID del inversor y la hora de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor_id')
        hora = request.query_params.get('hora')
        print(f"inversor_id: {inversor_id}, hora: {hora}")

        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            inversor = Inversor.objects.get(pk=inversor_id)
            horasdas = inversor.obtener_MinMaxProm_producciones_hora(hora)
            print(horasdas)
            producciones = inversor.obtener_producciones_hora(hora)
            serializer = ProduccionSerializer(producciones, many=True)

            response_data = {
                'nombre_inversor': inversor.nombre, 
                'producciones': serializer.data,
                'minimo': producciones.aggregate(minimo=Min('cantidad'))['minimo'], # Obtener el valor mínimo
                'maximo': producciones.aggregate(maximo=Max('cantidad'))['maximo'], # Obtener el valor máximo
                'promedio': producciones.aggregate(promedio=Avg('cantidad'))['promedio'], # Obtener el promedio
            }
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class InversorMinMaxHoraView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el ID del inversor y la hora de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor_id')
        hora = request.query_params.get('hora')
        print(f"inversor_id: {inversor_id}, hora: {hora}")

        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            inversor = Inversor.objects.get(pk=inversor_id)
            producciones = inversor.obtener_producciones_hora(hora)

            response_data = {
                'nombre_inversor': inversor.nombre, 
                'minimo': producciones.aggregate(minimo=Min('cantidad'))['minimo'], # Obtener el valor mínimo
                'maximo': producciones.aggregate(maximo=Max('cantidad'))['maximo'], # Obtener el valor máximo
            }
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VariableLinguisticaHoraView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el valor, min y max de los parámetros de la solicitud
        valor = request.query_params.get('valor')
        min_value = request.query_params.get('min')
        max_value = request.query_params.get('max')
        print(f"valor: {valor}, min: {min_value}, max: {max_value}")

        if valor is None or min_value is None or max_value is None:
            return Response({"error": "Se requiere el parámetro 'valor', 'min' y 'max'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Convertir los valores de valor, min y max a flotantes
            valor = float(valor)
            min_value = float(min_value)
            max_value = float(max_value)

            TLbaja, TLmedia, TLalta = obtenerPercepcionComputacionalPrimerGrado(min_value, max_value)

            # Calcular el grado de pertenencia del valor
            pertenencia_baja = calcular_pertenencia_baja(valor, TLbaja)
            pertenencia_media = calcular_pertenencia_media(valor, TLmedia)
            pertenencia_alta = calcular_pertenencia_alta(valor, TLalta)

            # Preparar la respuesta
            response_data = {
                'TLbaja': TLbaja,
                'TLmedia': TLmedia,
                'TLalta': TLalta,
                'pertenencia': {
                    'baja': round(pertenencia_baja, 2),
                    'media': round(pertenencia_media, 2),
                    'alta': round(pertenencia_alta, 2)
                }
            }
            return Response(response_data, status=status.HTTP_200_OK)
        
        except ValueError:
            return Response({"error": "Los parámetros 'valor', 'min' y 'max' deben ser numéricos"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class InversorProduccionGradoPertenenciaView(APIView): 
    def get(self, request, *args, **kwargs):
        # Obtener el ID del inversor de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor_id')

        print(f"inversor_id: {inversor_id}")
        
        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtener el inversor
            inversor = Inversor.objects.get(pk=inversor_id)
            
            # Obtener las estadísticas por hora del inversor
            estadisticas_por_hora = inversor.obtener_MinMaxProm_producciones()
            
            # Obtener las producciones del inversor
            producciones = inversor.obtener_producciones()
            
            TLlist = []

            # Iterar sobre cada producción
            for produccion in producciones:
                # Extraer el número de la hora (remover el prefijo "H")
                hora_num = int(produccion.Hora.replace('H', ''))
                
                # Buscar las estadísticas correspondientes para esa hora
                estadisticas_hora = next(
                    (e for e in estadisticas_por_hora if e['hora_num'] == hora_num), 
                    None
                )
                
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

class ObtenerPercepcionesComputacionalesView(APIView): 
    def get(self, request, *args, **kwargs):
        # Obtener el día y la hora de los parámetros de la solicitud
        dia = request.query_params.get('dia')
        hora = request.query_params.get('hora')

        if not dia:
            return Response({"error": "Se requiere el parámetro 'dia'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Lista para almacenar las percepciones de cada inversor
            percepciones = []
            
            inversores = Inversor.objects.all()

            for inversor in inversores:
                # Filtrar la producción para el día y hora especificados
                produccion = Produccion.objects.filter(Dia=dia, inversor=inversor, Hora=hora).values('cantidad').first()
                
                # Validar si hay producción en ese día y hora
                if produccion:
                    cantidad = produccion['cantidad']
                    
                    # Obtener las estadísticas de la hora para calcular los términos lingüísticos
                    estadisticas_hora = inversor.obtener_MinMaxProm_producciones_hora(hora).first()
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

class ObtenerPercepcionesDiariasView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener el día de los parámetros de la solicitud
        dia = request.query_params.get('dia')

        if not dia:
            return Response({"error": "Se requiere el parámetro 'dia'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Lista para almacenar las percepciones por hora
            percepciones_diarias = []

            inversores = Inversor.objects.all()

            # Recorrer cada hora desde las 8 hasta las 22
            for hora in range(8, 23):
                hora_str = f'H{hora}'
                percepciones = []  # Lista para almacenar las percepciones de cada inversor en la hora actual
                produccion_encontrada = False  # Bandera para verificar si se encontró producción en la hora actual

                for inversor in inversores:
                    # Filtrar la producción para el día y hora especificados
                    produccion = Produccion.objects.filter(Dia=dia, inversor=inversor, Hora=hora_str).values('cantidad').first()
                    
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

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])

    if not user.check_password(request.data['password']):
        return Response({"error": "Contraseña incorrecta"}, status=status.HTTP_400_BAD_REQUEST)
    
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)

    return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        user = User.objects.get(username=serializer.data['username'])
        user.set_password(serializer.data['password'])
        user.save()

        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



