from django import forms
from .models import ArtifactModel


class ArtifactForm(forms.Form):
    id = forms.CharField(label='id', max_length=30)
    s3_url = forms.CharField(label='s3_url')
    n_cells = forms.IntegerField(label='n_cells')
    empty_cells = forms.IntegerField(label='empty_cells')


class UploadCellFileForm(forms.Form):
    file = forms.FileField()


class ArtifactPostForm(forms.ModelForm):
    class Meta:
        model = ArtifactModel
        fields = ('id',
                  's3_url',
                  'n_cells',
                  'empty_cells',
                  )
