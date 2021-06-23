from django.http import HttpResponse, JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

from rest_framework_swagger.renderers import OpenAPIRenderer, SwaggerUIRenderer
from rest_framework.decorators import api_view, renderer_classes

from .models import ArtifactModel
from .serializers import ArtifactSerializer
from .forms import ArtifactPostForm, UploadCellFileForm

from .storage import download_from_s3, upload_to_s3
import json
from .utils import load_img


def create_artifact():
    data = dict()
    #im = np.zeros((300,300,3), dtype=np.uint8)
    data['s3_url'] = ""
    data['s3_key'] = "" #upload_to_s3(im)
    data['n_cells'] = settings.NUM_OF_CELLS
    data['empty_cells'] = json.dumps([i for i in range(settings.NUM_OF_CELLS)])
    data['filled_cells'] = json.dumps([])

    serializer = ArtifactSerializer(data=data)
    if serializer.is_valid():
        serializer.save()


@csrf_exempt
@api_view(['GET', 'POST'])
@renderer_classes([SwaggerUIRenderer, OpenAPIRenderer])
def artifacts(request):
    # get all artifacts
    if request.method == 'GET':
        queryset = ArtifactModel.objects.all()
        serializer = ArtifactSerializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

    if request.method == 'POST':
        create_artifact()
        return HttpResponse(status=201)


@csrf_exempt
@api_view()
@renderer_classes([SwaggerUIRenderer, OpenAPIRenderer])
def artifacts_id(request, artifact_id: str):
    if request.method == 'GET':
        queryset = (
            ArtifactModel
                .objects
                .get(pk=artifact_id)
        )
        return JsonResponse(json.loads(queryset.filled_cells), safe=False)


@csrf_exempt
@api_view(['GET', 'POST'])
@renderer_classes([SwaggerUIRenderer, OpenAPIRenderer])
def cells(request, artifact_id, cell_id):
    if request.method == 'GET':
        queryset = (
            ArtifactModel
                .objects
                .get(pk=artifact_id)
        )
        for cell in json.loads(queryset.filled_cells):
            if cell['cell_id'] == cell_id:
                return JsonResponse(cell, safe=False)
        return HttpResponse(status=204)

    elif request.method == 'POST':
        artifact = ArtifactModel.objects.get(pk=artifact_id)
        form = UploadCellFileForm(request.POST, request.FILES)
        if form.is_valid():
            cell_im = load_img(request.FILES['file'])

            empty_cells = json.loads(artifact.empty_cells)
            filled_cells = json.loads(artifact.filled_cells)

            if cell_id not in empty_cells:
                for fc in filled_cells:
                    if fc['cell_id'] == cell_id:
                        url, key = upload_to_s3(cell_im, fc['s3_url'].split('/')[-1])
                        break
            else:
                url, key = upload_to_s3(cell_im)
                filled_cells.append({
                    "artifact_id": artifact.id,
                    "cell_id": cell_id,
                    "s3_url": url
                })
                empty_cells.remove(cell_id)
                artifact.empty_cells = json.dumps(empty_cells)
                artifact.filled_cells = json.dumps(filled_cells)
                artifact.save()

            return HttpResponse(status=200)

    return HttpResponse(status=400)

@csrf_exempt
@api_view(['GET'])
@renderer_classes([SwaggerUIRenderer, OpenAPIRenderer])
def image_from_url(request):
    url = request.GET['key']
    img = open(download_from_s3(url), 'rb')
    return FileResponse(img)


@csrf_exempt
@api_view(['GET', 'POST'])
@renderer_classes([SwaggerUIRenderer, OpenAPIRenderer])
def pixel_art(request):
    pass
