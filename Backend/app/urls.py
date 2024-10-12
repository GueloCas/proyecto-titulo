from django.urls import path, include
from rest_framework import routers
from .views import InversorViewSet, ProduccionViewSet, ExcelUploadView, InversorProduccionView

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
]

