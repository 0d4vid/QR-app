# QR App Backend

This is the backend service for the QR App. It provides APIs for generating and managing QR codes.

## Features

- Generate QR codes.
- Manage QR code data.
- RESTful API endpoints.

## Requirements

- Python 3.8+
- Dependencies listed in `requirements.txt`

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/qr-app-backend.git
    cd qr-app-backend
    ```

2. Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Usage

1. Run the development server:
    ```bash
    python app.py
    ```

2. Access the API at `http://localhost:5000`.

## Testing

Run the test suite:
```bash
pytest
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.