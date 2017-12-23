import requests

x = {}
x['quote'] = input('Quote: ')
x['char'] = input('Character Name: ')
x['anime'] = input('Name of Anime: ')
x['episode'] = input('Episode: ')
x['submitter'] = input('Your Name or Alias: ')
x['img'] = input('Image: ')

r = requests.post('http://otakuquotes.com:82/api/submit', data=x)

if (r.status_code == 200):
    input('Thanks for submitting!')
else:
    input('Something went wrong! Ask Dan')
