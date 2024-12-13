from django.urls import path, include
from rest_framework import routers
from .views import EstacionViewSet, InversorViewSet, ProduccionViewSet, InversorProduccionView, VariableLinguisticaHoraView
from .views_folder.subir_datos_views import ExcelUploadView, CSVUploadView
from .views_folder.estadisticas_views import MetricasEstacionHoraMesView, MetricasEstacionGeneralMesView, MetricasEstacionGeneralDiaView, MetricasEstacionHoraDiaView, MetricasInversorMesView
from .views_folder.descripciones_views import CalcularDescripcionesLinguisticasInversor, CalcularDescripcionesLinguisticasEstacion
from .views_folder.percepciones_views import ObtenerPercepcionesSegundoGradoDiaHoraView, ObtenerPercepcionesSegundoGradoDiaView, ObtenerPercepcionesPrimerGradoDiaView, ObtenerPercepcionesPrimerGradoHoraView
from .views_folder.filters_views import FilterAnioByInversorView, FilterMesByAnioInversorView, FilterDiaByMesAnioInversorView, FilterHoraByDiaMesAnioInversorView, FilterHoraByMesAnioInversorView, FilterAnioByEstacionView, FilterMesByAnioEstacionView, FilterDiaByMesAnioEstacionView, FilterHoraByMesAnioEstacionView, FilterHoraByDiaMesAnioEstacionView
from .views_folder.informes_views import GenerarInformeInversorView, GenerarInformeEstacionView
from .views_folder.estaciones_views import EstacionesByUserView, InversoresByUserView
from .views import login, register
from .views import UserViewSet

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
router.register(r'user', UserViewSet, 'user')

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/v1/upload-excel/', ExcelUploadView.as_view(), name='upload-excel'),
    path('api/v1/upload-csv/', CSVUploadView.as_view(), name='upload-csv'),

    path("api/v1/produccion-por-inversor/", InversorProduccionView.as_view(), name="produccion-por-inversor"),
    path('api/v1/variable-linguistica-hora/', VariableLinguisticaHoraView.as_view(), name='variable-linguistica-hora'),
    
    path('api/v1/percepciones-segundo-grado-dia-hora/', ObtenerPercepcionesSegundoGradoDiaHoraView.as_view(), name='percepciones-segundo-grado-dia-hora'),
    path('api/v1/percepciones-segundo-grado-dia/', ObtenerPercepcionesSegundoGradoDiaView.as_view(), name='percepciones-segundo-grado-dia'),
    path('api/v1/percepciones-primer-grado-dia/', ObtenerPercepcionesPrimerGradoDiaView.as_view(), name='percepciones-primer-grado-dia'),
    path('api/v1/percepciones-primer-grado-hora/', ObtenerPercepcionesPrimerGradoHoraView.as_view(), name='percepciones-primer-grado-hora'),

    path("api/v1/metricas-estacion-hora-mes/", MetricasEstacionHoraMesView.as_view(), name="metricas-estacion"),
    path("api/v1/metricas-estacion-general-mes/", MetricasEstacionGeneralMesView.as_view(), name="metricas-estacion-general-mes"),
    path("api/v1/metricas-estacion-general-dia/", MetricasEstacionGeneralDiaView.as_view(), name='metricas-estacion-general-dia'),
    path("api/v1/metricas-estacion-hora-dia/", MetricasEstacionHoraDiaView.as_view(), name='metricas-estacion-hora-dia'),

    path("api/v1/metricas-inversor-mes/", MetricasInversorMesView.as_view(), name="metricas-inversor-mes"),

    path('api/v1/descripciones-linguisticas-inversor/', CalcularDescripcionesLinguisticasInversor.as_view(), name='descripciones-linguisticas-inversor'),
    path('api/v1/descripciones-linguisticas-estacion/', CalcularDescripcionesLinguisticasEstacion.as_view(), name='descripciones-linguisticas-estacion'),

    path('api/v1/informe-inversor/', GenerarInformeInversorView.as_view(), name='informe-inversor'),
    path('api/v1/informe-estacion/', GenerarInformeEstacionView.as_view(), name='informe-estacion'),

    path('api/v1/estacionesByUser/', EstacionesByUserView.as_view(), name='estacionesByUser'),
    path('api/v1/inversoresByUser/', InversoresByUserView.as_view(), name='inversoresByUser'),

    path('api/v1/filters/anio-by-inversor/', FilterAnioByInversorView.as_view(), name='anio-by-inversor'),
    path('api/v1/filters/mes-by-anio-inversor/', FilterMesByAnioInversorView.as_view(), name='mes-by-anio-inversor'),
    path('api/v1/filters/dia-by-mes-anio-inversor/', FilterDiaByMesAnioInversorView.as_view(), name='dia-by-mes-anio-inversor'),
    path('api/v1/filters/hora-by-mes-anio-inversor/', FilterHoraByMesAnioInversorView.as_view(), name='hora-by-mes-anio-inversor'),
    path('api/v1/filters/hora-by-dia-mes-anio-inversor/', FilterHoraByDiaMesAnioInversorView.as_view(), name='hora-by-dia-mes-anio-inversor'),

    path('api/v1/filters/anio-by-estacion/', FilterAnioByEstacionView.as_view(), name='anio-by-estacion'),
    path('api/v1/filters/mes-by-anio-estacion/', FilterMesByAnioEstacionView.as_view(), name='mes-by-anio-estacion'),
    path('api/v1/filters/dia-by-mes-anio-estacion/', FilterDiaByMesAnioEstacionView.as_view(), name='dia-by-mes-anio-estacion'),
    path('api/v1/filters/hora-by-mes-anio-estacion/', FilterHoraByMesAnioEstacionView.as_view(), name='hora-by-mes-anio-estacion'),
    path('api/v1/filters/hora-by-dia-mes-anio-estacion/', FilterHoraByDiaMesAnioEstacionView.as_view(), name='hora-by-dia-mes-anio-estacion'),
    
    path('api/v1/login/', login, name='login'),
    path('api/v1/register/', register, name='register'),
]

