from rest_framework import serializers
from .models import Inversor, Produccion, Estacion
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from rest_framework.authtoken.models import Token 

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
    
    def update(self, instance, validated_data):
        # Manejar la contraseña solo si se proporciona
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)
    
class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        current_password = attrs.get('current_password')
        new_password = attrs.get('new_password')
        confirm_new_password = attrs.get('confirm_new_password')

        # Verificar si las contraseñas coinciden
        if new_password != confirm_new_password:
            raise ValidationError("Las contraseñas no coinciden")

        # Obtener el token desde los datos de la solicitud
        token = self.context.get('request').headers.get('authorization')

        if not token:
            raise ValidationError("Token no proporcionado")

        try:
            # Buscar el token en la base de datos
            user_token = Token.objects.get(key=token)
            user = user_token.user  # Obtener el usuario asociado al token
        except Token.DoesNotExist:
            raise ValidationError("Token inválido o no encontrado")

        # Verificar la contraseña actual
        if not user.check_password(current_password):
            raise ValidationError("La contraseña actual es incorrecta")

        # Asegurarse de que la nueva contraseña no sea igual a la actual
        if current_password == new_password:
            raise ValidationError("La nueva contraseña no puede ser igual a la actual")

        return attrs

    