import json

from app import db_helper


def test_read_db_returns_dict_from_temp_file(tmp_path, monkeypatch):
    """read_db should load and return JSON content from the configured DB file."""
    temp_db = tmp_path / "db.json"
    expected = {"vehicles": [{"id": 1, "name": "City Car"}], "rentals": []}
    temp_db.write_text(json.dumps(expected), encoding="utf-8")

    monkeypatch.setattr(db_helper, "DB_PATH", str(temp_db))

    result = db_helper.read_db()

    assert result == expected


def test_write_db_persists_data_to_temp_file(tmp_path, monkeypatch):
    """write_db should persist a Python dict as JSON to the configured DB file."""
    temp_db = tmp_path / "db.json"
    payload = {
        "vehicles": [{"id": 2, "name": "Cargo Van", "status": "available"}],
        "rentals": [{"id": 1, "vehicle_id": 2}],
    }

    monkeypatch.setattr(db_helper, "DB_PATH", str(temp_db))

    db_helper.write_db(payload)

    with temp_db.open("r", encoding="utf-8") as file_handle:
        stored = json.load(file_handle)

    assert stored == payload
