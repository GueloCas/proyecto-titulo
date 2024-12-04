from datetime import datetime

def convertToDatetime(fecha_str):
    fecha_obj = datetime.strptime(fecha_str, "%d-%b-%Y").date()
    return fecha_obj

mes_dict = {
    1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril', 5: 'Mayo', 6: 'Junio',
    7: 'Julio', 8: 'Agosto', 9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
}
