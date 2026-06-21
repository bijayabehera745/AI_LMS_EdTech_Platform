"""
scenarios/views.py

GET /api/v1/scenarios/           → list all active scenarios (filterable by ?model_type=)
GET /api/v1/scenarios/{id}/      → full detail with all variants
"""

from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Scenario
from .serializers import ScenarioListSerializer, ScenarioDetailSerializer


class ScenarioListView(generics.ListAPIView):
    """
    List all active scenarios.
    Optional query param: ?model_type=REGRESSION | CLASSIFICATION | NEURAL_NETWORK
    """
    serializer_class   = ScenarioListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Scenario.objects.filter(is_active=True)
        model_type = self.request.query_params.get('model_type')
        if model_type:
            qs = qs.filter(model_type=model_type.upper())
        return qs


class ScenarioDetailView(generics.RetrieveAPIView):
    """Return full scenario detail including all data variants."""
    serializer_class   = ScenarioDetailSerializer
    permission_classes = [AllowAny]
    queryset           = Scenario.objects.filter(is_active=True)
