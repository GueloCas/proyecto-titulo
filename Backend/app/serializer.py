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

class CambiarContraSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True, min_length=8)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("La contraseña actual es incorrecta.")
        return value