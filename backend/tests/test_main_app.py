from fastapi import FastAPI


def test_main_app_import_and_routes_exist():
    import main

    assert isinstance(main.app, FastAPI)

    paths = {r.path for r in main.app.routes}

    assert "/api/register" in paths
    assert "/api/login" in paths
    assert "/api/ads" in paths
    assert "/api/server/stats" in paths
