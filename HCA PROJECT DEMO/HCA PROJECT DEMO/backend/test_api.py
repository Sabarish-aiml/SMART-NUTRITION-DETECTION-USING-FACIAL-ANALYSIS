import urllib.request
import mimetypes

def encode_multipart_formdata(fields, files):
    boundary = '----------lImIt_of_THE_fIle_eW_$'
    
    body = bytearray()
    for key, value in fields.items():
        body.extend(f'--{boundary}\r\n'.encode('utf-8'))
        body.extend(f'Content-Disposition: form-data; name="{key}"\r\n\r\n'.encode('utf-8'))
        body.extend(f'{value}\r\n'.encode('utf-8'))
        
    for key, filename, value in files:
        body.extend(f'--{boundary}\r\n'.encode('utf-8'))
        body.extend(f'Content-Disposition: form-data; name="{key}"; filename="{filename}"\r\n'.encode('utf-8'))
        content_ty = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
        body.extend(f'Content-Type: {content_ty}\r\n\r\n'.encode('utf-8'))
        body.extend(value)
        body.extend(b'\r\n')
        
    body.extend(f'--{boundary}--\r\n'.encode('utf-8'))
    return f'multipart/form-data; boundary={boundary}', body

if __name__ == '__main__':
    with open('test_image.jpg', 'rb') as f:
        img_data = f.read()
    ls_data = '{"sleep_hours":7,"screen_time":4,"stress_level":5,"activity_level":5,"water_intake":2.0,"diet_quality":6,"protein_intake":5,"sugar_intake":5,"bmi":22,"skin_condition_perception":5,"hydration_perception":5}'
    try:
        content_type, body = encode_multipart_formdata({'lifestyleData': ls_data}, [('image', 'test_image.jpg', img_data)])
        req = urllib.request.Request('http://127.0.0.1:8000/api/analyze', data=body)
        req.add_header('Content-Type', content_type)
        response = urllib.request.urlopen(req)
        print(response.getcode())
        print(response.read().decode('utf-8'))
    except Exception as e:
        print(e)
        if hasattr(e, 'read'):
            print(e.read().decode('utf-8'))
