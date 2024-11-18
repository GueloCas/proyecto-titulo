from rest_framework import serializers
from .models import Inversor, Produccion, Estacion
from django.contrib.auth.models import User


class EstacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estacion
        fields = '__all__'
class InversorSerializer(serializers.ModelSerializer):
    nombre_estacion = serializers.CharField(source="estacion.nombre", read_only=True)  # 'estacion' es la relación hacia Estacion
    class Meta:
        model = Inversor
        fields = ['id', 'nombre', 'estacion', 'nombre_estacion']

class ProduccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produccion
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']