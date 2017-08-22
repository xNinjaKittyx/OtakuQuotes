import requests


def test_pending():
    r = requests.get('http://localhost:3000/api/pending')
    assert r.status_code == 200
    res = r.json()
    quotes = res['quotes']
    assert len(quotes) == 2
    r = requests.get('http://localhost:3000/api/pending?limit=1')
    assert r.status_code == 200
    res = r.json()
    quotes = res['quotes']
    assert len(quotes) == 1

if __name__ == "__main__":
    test_pending()
