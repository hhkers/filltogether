from rest_framework import serializers
from .models import ArtifactModel


class ArtifactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtifactModel
        fields = ['id',
                  's3_url',
                  's3_key',
                  'n_cells',
                  'filled_cells',
                  'empty_cells'
                  ]
