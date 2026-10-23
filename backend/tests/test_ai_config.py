import uuid

from app.api.v1 import ai as ai_api
from app.core.config import settings


def test_ai_routes_use_server_configured_openai_key(
    client, db_session, monkeypatch
):
    api_key = "server-configured-key"
    monkeypatch.setattr(settings, "OPENAI_API_KEY", api_key)
    received_keys = {}

    def analyze_field(field_id, db, configured_key):
        received_keys["analyze"] = configured_key
        return {"analysis_type": "ai_powered"}

    def query_with_ai(question, db, configured_key):
        received_keys["query"] = configured_key
        return {"answer_type": "ai_generated"}

    def summarize_project(project_id, db, configured_key):
        received_keys["summarize"] = configured_key
        return {"project_name": "Test project"}

    class FakeKnowledgeBase:
        def build_index(self, db, configured_key):
            received_keys["build_index"] = configured_key
            return {"index_type": "faiss_vector"}

    monkeypatch.setattr(ai_api, "analyze_field", analyze_field)
    monkeypatch.setattr(ai_api, "query_with_ai", query_with_ai)
    monkeypatch.setattr(ai_api, "summarize_project", summarize_project)
    monkeypatch.setattr(ai_api, "KnowledgeBase", FakeKnowledgeBase)

    field_id = uuid.uuid4()
    project_id = uuid.uuid4()

    responses = [
        client.post(f"/api/v1/ai/analyze-field/{field_id}?api_key=request-key"),
        client.post(
            "/api/v1/ai/query",
            json={"question": "Summarize field data", "api_key": "request-key"},
        ),
        client.post(f"/api/v1/ai/summarize-project/{project_id}?api_key=request-key"),
        client.post("/api/v1/ai/build-index?api_key=request-key"),
    ]

    assert [response.status_code for response in responses] == [200, 200, 200, 200]
    assert received_keys == {
        "analyze": api_key,
        "query": api_key,
        "summarize": api_key,
        "build_index": api_key,
    }


def test_ai_query_uses_fallback_when_openai_key_is_unset(
    client, db_session, monkeypatch
):
    monkeypatch.setattr(settings, "OPENAI_API_KEY", "")
    received_keys = []

    def query_with_ai(question, db, configured_key):
        received_keys.append(configured_key)
        return {"answer_type": "keyword_search"}

    monkeypatch.setattr(ai_api, "query_with_ai", query_with_ai)

    response = client.post(
        "/api/v1/ai/query",
        json={"question": "Find fields", "api_key": "request-key"},
    )

    assert response.status_code == 200
    assert received_keys == [None]
