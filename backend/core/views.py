from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def test_view(request):
    return Response({"message": "L'API fonctionne !"})

# Create your views here.
from rest_framework.viewsets import ModelViewSet
from .models import Article
from .serializers import ArticleSerializer
class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.all().order_by("-created_at")
    serializer_class = ArticleSerializer
