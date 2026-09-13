import pytest
from fastapi.testclient import TestClient

from app.config import settings
from main import app

client = TestClient(app)


def _register_and_token():
    reg = client.post("/auth/register", json={"email": "r@example.com", "password": "password123"})
    return reg.json()["access_token"]


def test_upload_invalid_type():
    token = _register_and_token()
    resp = client.post(
        "/resumes/upload",
        files={"file": ("test.txt", b"hello", "text/plain")},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 422


def test_upload_too_large():
    token = _register_and_token()
    big = b"x" * (11 * 1024 * 1024)
    resp = client.post(
        "/resumes/upload",
        files={"file": ("big.pdf", big, "application/pdf")},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 422


def test_list_resumes_empty():
    token = _register_and_token()
    resp = client.get("/resumes", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["total"] == 0


@pytest.fixture(autouse=True)
def local_upload_path(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "LOCAL_UPLOAD_PATH", str(tmp_path))
