from django.urls import path, include
from rest_framework import routers
from .views import EstacionViewSet, InversorViewSet, ProduccionViewSet, InversorProduccionView, InversorProduccionHoraView, VariableLinguisticaHoraView, InversorMinMaxHoraView, InversorProduccionEstadisticasView, InversorProduccionGradoPertenenciaView
from .views_nuevo.subir_datos_views import ExcelUploadView, CSVUploadView
from .views_nuevo.estadisticas_views import MetricasEstacionHoraMesView, MetricasEstacionGeneralMesView, MetricasEstacionGeneralDiaView, MetricasEstacionHoraDiaView
from .views_nuevo.descripciones_views import CalcularDescripcionesLinguisticasInversor, CalcularDescripcionesLinguisticasEstacion
from .views_nuevo.percepciones_views import ObtenerPercepcionesSegundoGradoDiaHoraView, ObtenerPercepcionesSegundoGradoDiaView, ObtenerPercepcionesPrimerGradoDiaView, ObtenerPercepcionesPrimerGradoHoraView
from .views import login, register

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(title="API", default_version='v1'),
    public=True,
)

router = routers.DefaultRouter()
router.register(r'estacion', EstacionViewSet, 'estacion')
router.register(r'inversor', InversorViewSet, 'inversor')
router.register(r'produccion', ProduccionViewSet, 'produccion')

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/v1/upload-excel/', ExcelUploadView.as_view(), name='upload-excel'),
    path('api/v1/upload-csv/', CSVUploadView.as_view(), name='upload-csv'),
    path("api/v1/produccion-por-inversor/", InversorProduccionView.as_view(), name="produccion-por-inversor"),
    path("api/v1/produccion-por-inversor-estadisticas/", InversorProduccionEstadisticasView.as_view(), name="produccion-por-inversor-estadisticas"),
    path("api/v1/produccion-por-inversor-hora/", InversorProduccionHoraView.as_view(), name="produccion-por-inversor-hora"),
    path("api/v1/produccion-por-inversor-grados/", InversorProduccionGradoPertenenciaView.as_view(), name="produccion-por-inversor-grados"),
    path("api/v1/min-max-hora/", InversorMinMaxHoraView.as_view(), name="min-max-hora"),
    path('api/v1/variable-linguistica-hora/', VariableLinguisticaHoraView.as_view(), name='variable-linguistica-hora'),
    
    path('api/v1/percepciones-segundo-grado-dia-hora/', ObtenerPercepcionesSegundoGradoDiaHoraView.as_view(), name='percepciones-segundo-grado-dia-hora'),
    path('api/v1/percepciones-segundo-grado-dia/', ObtenerPercepcionesSegundoGradoDiaView.as_view(), name='percepciones-segundo-grado-dia'),
    path('api/v1/percepciones-primer-grado-dia/', ObtenerPercepcionesPrimerGradoDiaView.as_view(), name='percepciones-primer-grado-dia'),
    path('api/v1/percepciones-primer-grado-hora/', ObtenerPercepcionesPrimerGradoHoraView.as_view(), name='percepciones-primer-grado-hora'),

    path("api/v1/metricas-estacion-hora-mes/", MetricasEstacionHoraMesView.as_view(), name="metricas-estacion"),
    path("api/v1/metricas-estacion-general-mes/", MetricasEstacionGeneralMesView.as_view(), name="metricas-estacion-general-mes"),
    path("api/v1/metricas-estacion-general-dia/", MetricasEstacionGeneralDiaView.as_view(), name='metricas-estacion-general-dia'),
    path("api/v1/metricas-estacion-hora-dia/", MetricasEstacionHoraDiaView.as_view(), name='metricas-estacion-hora-dia'),

    path('api/v1/descripciones-linguisticas-inversor/', CalcularDescripcionesLinguisticasInversor.as_view(), name='descripciones-linguisticas-inversor'),
    path('api/v1/descripciones-linguisticas-estacion/', CalcularDescripcionesLinguisticasEstacion.as_view(), name='descripciones-linguisticas-estacion'),
    
    path('api/v1/login/', login, name='login'),
    path('api/v1/register/', register, name='register'),
]

