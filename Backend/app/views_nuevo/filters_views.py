from app.models import Inversor, Produccion, Estacion
from rest_framework import status 
from rest_framework.views import APIView 
from rest_framework.response import Response
from django.db.models import IntegerField
from django.db.models.functions import Substr
from app.utils.filters import convertToDatetime, mes_dict

class FilterAnioByInversorView(APIView):
    def get(self, request, *args, **kwargs):
        id_inversor = request.query_params.get('inversor')

        if id_inversor is None:
            return Response({'error': 'No se ha proporcionado el inversor'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            inversor = Inversor.objects.get(id=id_inversor)

            producciones = Produccion.objects.filter(inversor=inversor)

            anios = []
            for produccion in producciones:
                fecha = convertToDatetime(produccion.Dia)
                anio = fecha.year
                if anio not in anios:
                    anios.append(anio)

            anios_ordenadas = sorted(anios)
            
            return Response({'anios': anios_ordenadas}, status=status.HTTP_200_OK)
        except Inversor.DoesNotExist:
            return Response({'error': 'No se ha encontrado el inversor'}, status=status.HTTP_404_NOT_FOUND)

class FilterMesByAnioInversorView(APIView):
    def get(self, request, *args, **kwargs):
        id_inversor = request.query_params.get('inversor')
        anio = request.query_params.get('anio')

        if id_inversor is None:
            return Response({'error': 'No se ha proporcionado el inversor'}, status=status.HTTP_400_BAD_REQUEST)
        if anio is None:
            return Response({'error': 'No se ha proporcionado el año'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            inversor = Inversor.objects.get(id=id_inversor)

            producciones = Produccion.objects.filter(inversor=inversor)

            meses = []

            for produccion in producciones:
                fecha = convertToDatetime(produccion.Dia)  # Asumimos que la fecha está en formato adecuado
                if fecha.year == int(anio):
                    mes = fecha.month
                    if mes not in [m['value'] for m in meses]:  # Verifica si el mes ya ha sido agregado
                        meses.append({
                            'value': mes,
                            'label': mes_dict.get(mes)  # Obtiene el nombre del mes
                        })
            
            meses_ordenados = sorted(meses, key=lambda x: x['value'])

            return Response({'meses': meses_ordenados}, status=status.HTTP_200_OK)
        except Inversor.DoesNotExist:
            return Response({'error': 'No se ha encontrado el inversor'}, status=status.HTTP_404_NOT_FOUND)
        
class FilterDiaByMesAnioInversorView(APIView):
    def get(self, request, *args, **kwargs):
        id_inversor = request.query_params.get('inversor')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')

        if id_inversor is None:
            return Response({'error': 'No se ha proporcionado el inversor'}, status=status.HTTP_400_BAD_REQUEST)
        if anio is None:
            return Response({'error': 'No se ha proporcionado el año'}, status=status.HTTP_400_BAD_REQUEST)
        if mes is None:
            return Response({'error': 'No se ha proporcionado el mes'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            inversor = Inversor.objects.get(id=id_inversor)

            producciones = Produccion.objects.filter(inversor=inversor)

            dias = []
            for produccion in producciones:
                fecha = convertToDatetime(produccion.Dia)
                if fecha.year == int(anio) and fecha.month == int(mes):
                    dia = fecha.day
                    if dia not in dias:
                        dias.append(dia)

            dias_ordenadas = sorted(dias)
            
            return Response({'dias': dias_ordenadas}, status=status.HTTP_200_OK)
        except Inversor.DoesNotExist:
            return Response({'error': 'No se ha encontrado el inversor'}, status=status.HTTP_404_NOT_FOUND)
        
class FilterHoraByMesAnioInversorView(APIView):
    def get(self, request, *args, **kwargs):
        id_inversor = request.query_params.get('inversor')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')

        if id_inversor is None:
            return Response({'error': 'No se ha proporcionado el inversor'}, status=status.HTTP_400_BAD_REQUEST)
        if anio is None:
            return Response({'error': 'No se ha proporcionado el año'}, status=status.HTTP_400_BAD_REQUEST)
        if mes is None:
            return Response({'error': 'No se ha proporcionado el mes'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            inversor = Inversor.objects.get(id=id_inversor)

            producciones = Produccion.objects.filter(inversor=inversor)

            horas = []
            for produccion in producciones:
                fecha = convertToDatetime(produccion.Dia)
                if fecha.year == int(anio) and fecha.month == int(mes):
                    hora = int(produccion.Hora[1:]) if produccion.Hora.startswith("H") else int(produccion.Hora)
                    if hora not in horas:
                        horas.append(hora)
            
            horas_ordenadas = sorted(horas)  # Ordena las horas de menor a mayor

            return Response({'horas': horas_ordenadas}, status=status.HTTP_200_OK)
        except Inversor.DoesNotExist:
            return Response({'error': 'No se ha encontrado el inversor'}, status=status.HTTP_404_NOT_FOUND)
        
class FilterHoraByDiaMesAnioInversorView(APIView):
    def get(self, request, *args, **kwargs):
        id_inversor = request.query_params.get('inversor')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')
        dia = request.query_params.get('dia')

        if id_inversor is None:
            return Response({'error': 'No se ha proporcionado el inversor'}, status=status.HTTP_400_BAD_REQUEST)
        if anio is None:
            return Response({'error': 'No se ha proporcionado el año'}, status=status.HTTP_400_BAD_REQUEST)
        if mes is None:
            return Response({'error': 'No se ha proporcionado el mes'}, status=status.HTTP_400_BAD_REQUEST)
        if dia is None:
            return Response({'error': 'No se ha proporcionado el dia'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            inversor = Inversor.objects.get(id=id_inversor)

            producciones = Produccion.objects.filter(inversor=inversor)

            horas = []
            for produccion in producciones:
                fecha = convertToDatetime(produccion.Dia)
                if fecha.year == int(anio) and fecha.month == int(mes) and fecha.day == int(dia):
                    hora = int(produccion.Hora[1:]) if produccion.Hora.startswith("H") else int(produccion.Hora)
                    if hora not in horas:
                        horas.append(hora)
            
            horas_ordenadas = sorted(horas)  # Ordena las horas de menor a mayor

            return Response({'horas': horas_ordenadas}, status=status.HTTP_200_OK)
        except Inversor.DoesNotExist:
            return Response({'error': 'No se ha encontrado el inversor'}, status=status.HTTP_404_NOT_FOUND)
        
class FilterAnioByEstacionView(APIView):
    def get(self, request, *args, **kwargs):
        id_estacion = request.query_params.get('estacion')

        if id_estacion is None:
            return Response({'error': 'No se ha proporcionado la estación'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            estacion = Estacion.objects.get(id=id_estacion)

            inversores = Inversor.objects.filter(estacion=estacion)

            for inversor in inversores:
                producciones = Produccion.objects.filter(inversor=inversor)

                anios = []
                for produccion in producciones:
                    fecha = convertToDatetime(produccion.Dia)
                    anio = fecha.year
                    if anio not in anios:
                        anios.append(anio)

            anios_ordenadas = sorted(anios)
            
            return Response({'anios': anios_ordenadas}, status=status.HTTP_200_OK)
        except Estacion.DoesNotExist:
            return Response({'error': 'No se ha encontrado la estación'}, status=status.HTTP_404_NOT_FOUND)
        
class FilterMesByAnioEstacionView(APIView):
    def get(self, request, *args, **kwargs):
        id_estacion = request.query_params.get('estacion')
        anio = request.query_params.get('anio')

        if id_estacion is None:
            return Response({'error': 'No se ha proporcionado la estación'}, status=status.HTTP_400_BAD_REQUEST)
        if anio is None:
            return Response({'error': 'No se ha proporcionado el año'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            estacion = Estacion.objects.get(id=id_estacion)

            inversores = Inversor.objects.filter(estacion=estacion)

            meses = []

            for inversor in inversores:
                producciones = Produccion.objects.filter(inversor=inversor)

                for produccion in producciones:
                    fecha = convertToDatetime(produccion.Dia)  # Asumimos que la fecha está en formato adecuado
                    if fecha.year == int(anio):
                        mes = fecha.month
                        if mes not in [m['value'] for m in meses]:  # Verifica si el mes ya ha sido agregado
                            meses.append({
                                'value': mes,
                                'label': mes_dict.get(mes)  # Obtiene el nombre del mes
                            })
            
            meses_ordenados = sorted(meses, key=lambda x: x['value'])

            return Response({'meses': meses_ordenados}, status=status.HTTP_200_OK)
        except Estacion.DoesNotExist:
            return Response({'error': 'No se ha encontrado la estación'}, status=status.HTTP_404_NOT_FOUND)
        
class FilterDiaByMesAnioEstacionView(APIView):
    def get(self, request, *args, **kwargs):
        id_estacion = request.query_params.get('estacion')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')

        if id_estacion is None:
            return Response({'error': 'No se ha proporcionado la estación'}, status=status.HTTP_400_BAD_REQUEST)
        if anio is None:
            return Response({'error': 'No se ha proporcionado el año'}, status=status.HTTP_400_BAD_REQUEST)
        if mes is None:
            return Response({'error': 'No se ha proporcionado el mes'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            estacion = Estacion.objects.get(id=id_estacion)

            inversores = Inversor.objects.filter(estacion=estacion)

            dias = []
            for inversor in inversores:
                producciones = Produccion.objects.filter(inversor=inversor)

                for produccion in producciones:
                    fecha = convertToDatetime(produccion.Dia)
                    if fecha.year == int(anio) and fecha.month == int(mes):
                        dia = fecha.day
                        if dia not in dias:
                            dias.append(dia)
            
            dias_ordenadas = sorted(dias)
            
            return Response({'dias': dias_ordenadas}, status=status.HTTP_200_OK)
        except Estacion.DoesNotExist:
            return Response({'error': 'No se ha encontrado la estación'}, status=status.HTTP_404_NOT_FOUND)
        
class FilterHoraByMesAnioEstacionView(APIView):
    def get(self, request, *args, **kwargs):
        id_estacion = request.query_params.get('estacion')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')

        if id_estacion is None:
            return Response({'error': 'No se ha proporcionado la estación'}, status=status.HTTP_400_BAD_REQUEST)
        if anio is None:
            return Response({'error': 'No se ha proporcionado el año'}, status=status.HTTP_400_BAD_REQUEST)
        if mes is None:
            return Response({'error': 'No se ha proporcionado el mes'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            estacion = Estacion.objects.get(id=id_estacion)

            inversores = Inversor.objects.filter(estacion=estacion)

            horas = []
            for inversor in inversores:
                producciones = Produccion.objects.filter(inversor=inversor)

                for produccion in producciones:
                    fecha = convertToDatetime(produccion.Dia)
                    if fecha.year == int(anio) and fecha.month == int(mes):
                        hora = int(produccion.Hora[1:]) if produccion.Hora.startswith("H") else int(produccion.Hora)
                        if hora not in horas:
                            horas.append(hora)
            
            horas_ordenadas = sorted(horas)  # Ordena las horas de menor a mayor

            return Response({'horas': horas_ordenadas}, status=status.HTTP_200_OK)
        except Estacion.DoesNotExist:
            return Response({'error': 'No se ha encontrado la estación'}, status=status.HTTP_404_NOT_FOUND)
        
class FilterHoraByDiaMesAnioEstacionView(APIView):
    def get(self, request, *args, **kwargs):
        id_estacion = request.query_params.get('estacion')
        anio = request.query_params.get('anio')
        mes = request.query_params.get('mes')
        dia = request.query_params.get('dia')

        if id_estacion is None:
            return Response({'error': 'No se ha proporcionado la estación'}, status=status.HTTP_400_BAD_REQUEST)
        if anio is None:
            return Response({'error': 'No se ha proporcionado el año'}, status=status.HTTP_400_BAD_REQUEST)
        if mes is None:
            return Response({'error': 'No se ha proporcionado el mes'}, status=status.HTTP_400_BAD_REQUEST)
        if dia is None:
            return Response({'error': 'No se ha proporcionado el dia'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            estacion = Estacion.objects.get(id=id_estacion)

            inversores = Inversor.objects.filter(estacion=estacion)

            horas = []
            for inversor in inversores:
                producciones = Produccion.objects.filter(inversor=inversor)

                for produccion in producciones:
                    fecha = convertToDatetime(produccion.Dia)
                    if fecha.year == int(anio) and fecha.month == int(mes) and fecha.day == int(dia):
                        hora = int(produccion.Hora[1:]) if produccion.Hora.startswith("H") else int(produccion.Hora)
                        if hora not in horas:
                            horas.append(hora)
            
            horas_ordenadas = sorted(horas)  # Ordena las horas de menor a mayor

            return Response({'horas': horas_ordenadas}, status=status.HTTP_200_OK)
        except Estacion.DoesNotExist:
            return Response({'error': 'No se ha encontrado la estación'}, status=status.HTTP_404_NOT_FOUND)
        


        
        
