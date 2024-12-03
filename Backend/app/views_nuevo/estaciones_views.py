from app.models import Inversor, Produccion, Estacion
from rest_framework import status 
from rest_framework.views import APIView 
from rest_framework.response import Response
from django.contrib.auth.models import User

class EstacionesByUserView(APIView):
    def get(self, request):
        user_id = request.headers.get('User-ID')  # Obtener el ID del encabezado
        if user_id:
            try:
                user = User.objects.get(id=user_id)  # Buscar el usuario por ID

                estaciones = Estacion.objects.filter(usuario=user)

                return Response({'estaciones': estaciones.values()}, status=200)
            except User.DoesNotExist:
                return Response({'error': 'Usuario no encontrado'}, status=404)
    
        return Response({'error': 'ID de usuario no proporcionado'}, status=400)

class InversoresByUserView(APIView):
    def get(self, request):
        user_id = request.headers.get('User-ID')  # Obtener el ID del encabezado
        if user_id:
            try:
                user = User.objects.get(id=user_id)  # Buscar el usuario por ID

                # Filtrar estaciones asociadas al usuario
                estaciones = Estacion.objects.filter(usuario=user)

                # Crear una lista plana de inversores con detalles personalizados
                todos_inversores = []
                for estacion in estaciones:
                    inversores = Inversor.objects.filter(estacion=estacion)
                    nombre_estacion = estacion.nombre

                    for inversor in inversores:
                        todos_inversores.append({
                            'id': inversor.id,
                            'nombre': inversor.nombre,
                            'estacion': estacion.id,  # ID de la estación
                            'nombre_estacion': nombre_estacion  # Nombre de la estación
                        })

                return Response({'inversores': todos_inversores}, status=200)
            except User.DoesNotExist:
                return Response({'error': 'Usuario no encontrado'}, status=404)
    
        return Response({'error': 'ID de usuario no proporcionado'}, status=400)

