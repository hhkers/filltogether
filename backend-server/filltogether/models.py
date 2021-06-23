from django.db import models


class ArtifactModel(models.Model):
    id = models.AutoField(primary_key=True)
    s3_url = models.TextField(blank=True)
    s3_key = models.TextField(blank=True)
    n_cells = models.IntegerField()  # 전체 cell 개수
    filled_cells = models.TextField()  # 작업된 cell 정보
    empty_cells = models.TextField()  # 비어있는 cell 정보
