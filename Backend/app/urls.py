from django.urls import path, include
from rest_framework import routers
from .views import InversorViewSet, ProduccionViewSet, ExcelUploadView, InversorProduccionView, InversorProduccionHoraView, VariableLinguisticaHoraView, InversorMinMaxHoraView, InversorProduccionEstadisticasView, InversorProduccionGradoPertenenciaView

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(title="API", default_version='v1'),
    public=True,
)

router = routers.DefaultRouter()
router.register(r'inversor', InversorViewSet, 'inversor')
router.register(r'produccion', ProduccionViewSet, 'produccion')

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/v1/upload-excel/', ExcelUploadView.as_view(), name='upload-excel'),
    path("api/v1/produccion-por-inversor/", InversorProduccionView.as_view(), name="produccion-por-inversor"),
    path("api/v1/produccion-por-inversor-estadisticas/", InversorProduccionEstadisticasView.as_view(), name="produccion-por-inversor-estadisticas"),
    path("api/v1/produccion-por-inversor-hora/", InversorProduccionHoraView.as_view(), name="produccion-por-inversor-hora"),
    path("api/v1/produccion-por-inversor-grados/", InversorProduccionGradoPertenenciaView.as_view(), name="produccion-por-inversor-grados"),
    path("api/v1/min-max-hora/", InversorMinMaxHoraView.as_view(), name="min-max-hora"),
    path('api/v1/variable-linguistica-hora/', VariableLinguisticaHoraView.as_view(), name='variable-linguistica-hora'),

]

