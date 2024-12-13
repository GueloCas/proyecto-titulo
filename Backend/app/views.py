from .models import Inversor, Produccion, Estacion
from django.contrib.auth.models import User # type: ignore
from .serializer import InversorSerializer, ProduccionSerializer, UserSerializer, EstacionSerializer, ChangePasswordSerializer, ChangeUsernameSerializer
from rest_framework import viewsets, status # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.decorators import api_view, permission_classes, action# type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.authtoken.models import Token # type: ignore
from django.db.models import IntegerField, Min, Max, Avg # type: ignore
from django.db.models.functions import Cast, Substr # type: ignore
import pandas as pd # type: ignore
from rest_framework.exceptions import AuthenticationFailed

from django.shortcuts import get_object_or_404 # type: ignore

from app.utils.functions import calcular_pertenencia_baja, calcular_pertenencia_media, calcular_pertenencia_alta, obtenerPercepcionComputacionalPrimerGrado, obtenerPercepcionComputacionalSegundoGrado

class EstacionViewSet(viewsets.ModelViewSet):
    queryset = Estacion.objects.all()
    serializer_class = EstacionSerializer
    
class InversorViewSet(viewsets.ModelViewSet):
    queryset = Inversor.objects.all()
    serializer_class = InversorSerializer

class ProduccionViewSet(viewsets.ModelViewSet):
    queryset = Produccion.objects.all()
    serializer_class = ProduccionSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # Acción personalizada para cambiar la contraseña
    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        # Obtener el token desde el cuerpo de la solicitud (o encabezado, según prefieras)
        token = request.headers.get('Authorization')  # O usa 'Authorization' en headers
        
        if not token:
            return Response({"detail": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Buscar el token en la base de datos
            user_token = Token.objects.get(key=token)
            user = user_token.user  # Obtén el usuario asociado con el token

        except Token.DoesNotExist:
            raise AuthenticationFailed("Token inválido o no encontrado")

        # Aquí puedes validar si el usuario tiene permisos para cambiar la contraseña si lo deseas.
        # Por ejemplo: if user != request.user: raise PermissionDenied("No autorizado")

        # Ahora que tenemos al usuario, validamos la nueva contraseña.
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            new_password = serializer.validated_data['new_password']
            user.set_password(new_password)  # Establecer la nueva contraseña
            user.save()  # Guardar el usuario con la nueva contraseña
            return Response({"message": "Contraseña actualizada exitosamente"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Acción personalizada para cambiar el nombre del usuario
    @action(detail=False, methods=['post'], url_path='update-username')
    def update_username(self, request):
        # Obtener el token desde el encabezado de la solicitud
        token = request.headers.get('Authorization')  # 'Authorization' con 'A' mayúscula
        
        if not token:
            return Response({"detail": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)
    
        try:
            # Buscar el token en la base de datos
            user_token = Token.objects.get(key=token)
            user = user_token.user  # Obtén el usuario asociado con el token
        except Token.DoesNotExist:
            raise AuthenticationFailed("Token inválido o no encontrado")
        
        # Ahora validamos el nuevo nombre de usuario
        serializer = ChangeUsernameSerializer(data=request.data, context={'request': request})
    
        if serializer.is_valid():
            new_username = serializer.validated_data['username']
            
            # Actualizar el nombre de usuario
            user.username = new_username  # Establecer el nuevo nombre de usuario
            user.save()  # Guardar los cambios en el usuario
            
            return Response({"message": "Nombre de usuario actualizado exitosamente"}, status=status.HTTP_200_OK)
    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class InversorProduccionView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.headers.get('Authorization')  # O usa 'Authorization' en headers
        
        if not token:
            return Response({"detail": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        user_token = Token.objects.get(key=token)
        user = user_token.user  # Obtén el usuario asociado con el token

        # Obtener el ID del inversor de los parámetros de la solicitud
        inversor_id = request.query_params.get('inversor_id')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')

        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor_id'"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtener el inversor por ID
            inversor = Inversor.objects.get(pk=inversor_id)

            estacion = inversor.estacion

            if estacion.usuario != user:
                return Response({"error": "No tienes permiso para acceder a este recurso"}, status=status.HTTP_403_FORBIDDEN)

            producciones = inversor.obtener_producciones_ordenHora(anio, mes)
            
            serializer = ProduccionSerializer(producciones, many=True)

            # Crear respuesta
            response_data = {
                'nombre_inversor': inversor.nombre,  # Nombre del inversor
                'producciones': serializer.data,  # Producciones completas
            }

            return Response(response_data, status=status.HTTP_200_OK)
        
        except Inversor.DoesNotExist:
            return Response({"error": "No se encontró el inversor"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VariableLinguisticaHoraView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener parámetros de la solicitud
        inversor_id = request.query_params.get('inversor')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')
        dia = request.query_params.get('dia')
        hora = request.query_params.get('hora')

        # Validar parámetro obligatorio
        if not inversor_id:
            return Response({"error": "Se requiere el parámetro 'inversor'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            inversor = Inversor.objects.get(pk=inversor_id)
            # Convertir parámetros a enteros
            anio = int(anio) if anio else None
            mes = int(mes) if mes else None
            dia = int(dia) if dia else None

            # Filtrar producción específica
            filtro = {
                "inversor": inversor_id,
                "anio": anio,
                "mes": mes,
                "dia": dia,
                "hora": hora
            }

            produccion = Produccion.objects.filter(**filtro).first()

            if not produccion:
                return Response({"error": "No se encontró producción para los parámetros dados."},
                                status=status.HTTP_404_NOT_FOUND)

            # Obtener valor específico
            valor = float(produccion.cantidad)

            # Calcular mínimos y máximos para ese inversor, año, mes y hora
            qs_min_max = Produccion.objects.filter(
                inversor=inversor_id,
                anio=anio,
                mes=mes,
                hora=hora
            ).aggregate(
                minimo=Min('cantidad'),
                maximo=Max('cantidad')
            )

            min_value = float(qs_min_max['minimo']) if qs_min_max['minimo'] is not None else 0.0
            max_value = float(qs_min_max['maximo']) if qs_min_max['maximo'] is not None else 0.0

            # Calcular percepciones lingüísticas
            TLbaja, TLmedia, TLalta = obtenerPercepcionComputacionalPrimerGrado(min_value, max_value)

            # Calcular grados de pertenencia
            pertenencia_baja = calcular_pertenencia_baja(valor, TLbaja)
            pertenencia_media = calcular_pertenencia_media(valor, TLmedia)
            pertenencia_alta = calcular_pertenencia_alta(valor, TLalta)

            # Preparar la respuesta
            response_data = {
                "inversor": inversor.nombre,
                "valor": valor,
                "min": min_value,
                "max": max_value,
                "TLbaja": TLbaja,
                "TLmedia": TLmedia,
                "TLalta": TLalta,
                "pertenencia": {
                    "baja": round(pertenencia_baja, 2),
                    "media": round(pertenencia_media, 2),
                    "alta": round(pertenencia_alta, 2),
                },
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({"error": "Parámetros incorrectos o faltantes"}, status=status.HTTP_400_BAD_REQUEST)
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

        # Crear un token para el usuario
        token = Token.objects.create(user=user)

        # Eliminar la contraseña de los datos serializados
        user_data = serializer.data.copy()
        user_data.pop('password', None)

        return Response({'token': token.key, 'user': user_data}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

