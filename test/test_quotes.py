import requests


def test_quotes():
    r = requests.get('http://localhost:3000/api/quotes?tags=Fate')
    assert r.status_code == 200
    res = r.json()
    quotes = res['quotes']
    assert len(quotes) == 2

    r = requests.get('http://localhost:3000/api/quotes')
    assert r.status_code == 200
    res = r.json()
    quotes = res['quotes']
    assert len(quotes) == 2

    r = requests.get('http://localhost:3000/api/quotes?tags=Shirou')
    assert r.status_code == 200
    res = r.json()
    quotes = res['quotes']
    assert len(quotes) == 2

    r = requests.get('http://localhost:3000/api/quotes?tags=killed')
    assert r.status_code == 200
    res = r.json()
    quotes = res['quotes']
    assert len(quotes) == 2

if __name__ == "__main__":
    test_quotes()
