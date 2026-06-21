from django.urls import path
from .views import ScenarioListView, ScenarioDetailView

urlpatterns = [
    path('',        ScenarioListView.as_view(),   name='scenario-list'),
    path('<uuid:pk>/', ScenarioDetailView.as_view(), name='scenario-detail'),
]
