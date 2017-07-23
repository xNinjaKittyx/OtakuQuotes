import requests

x = {}
x['quote'] = input('Quote: ')
x['char'] = input('Character Name: ')
x['anime'] = input('Name of Anime: ')
x['episode'] = input('Episode: ')
x['submitter'] = input('Your Name or Alias: ')

r = requests.post('http://69.181.250.99:3000/api/submit', data=x)

if (r.status_code == 200):
    input('Thanks for submitting!')
else:
    input('Something went wrong! Ask Dan')
