import requests


def test_random():
    r = requests.get('http://localhost:3000/api/random')
    assert r.status_code == 200
    res = r.json()
    quote = res['quotes']
    assert quote['anime'] == 'Fate/Stay Night'
    assert quote['char'] == 'Emiya Shirou'
    assert quote['quote'] == 'People die when they are killed.'

if __name__ == "__main__":
    test_random()
