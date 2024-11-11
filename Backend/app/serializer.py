from rest_framework import serializers
from .models import Inversor, Produccion
from django.contrib.auth.models import User

class InversorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inversor
        fields = '__all__'

class ProduccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produccion
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']