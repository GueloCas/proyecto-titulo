from rest_framework import serializers
from .models import Inversor, Produccion

class InversorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inversor
        fields = '__all__'

class ProduccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produccion
        fields = '__all__'