from flask import Flask, request, jsonify
from flask_cors import CORS
import qrcode
from PIL import Image
import io

import qrcode.constants

app = Flask(__name__)
CORS(app) #Enable CORS for react native

def generate_qr_with_logo(url, logo_file=None):
    #Create QR code
    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert('RGB')

    #Add logo if provided
    if logo_file:
        logo = Image.open(logo_file.stream)
        logo_size = (img.size[0] // 4, img.size[1] // 4)
        logo.thumbnail(logo_size)
        position = (
            (img.size[0] - logo.size[0]) // 2,
            (img.size[1] - logo.size[1]) // 2
        )
        img.paste(logo, position, mask=logo.split()[3] if logo.mode == 'RGBA' else None)

    # Convert into bytes
    img_byte_aarr = io.BytesIO()
    img.save(img_byte_aarr, format='PNG')
    return img_byte_aarr.getvalue()
    

@app.route('/generate', methods=['POST'])
def generate_qr():
    try:
        url = request.form.get('url')
        logo = request.files.get('logo')

        if not url:
            return jsonify(error="URL is required"), 400
        
        qr_image = generate_qr_with_logo(url, logo)
        return jsonify(qr_code=qr_image.hex())
    
    except Exception as e:
        return jsonify(error=str(e)), 500
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)