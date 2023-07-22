from bs4 import BeautifulSoup
import requests
import re
import json


# Downloading imdb top 250 movie's data
url = 'https://www.imdb.com/chart/moviemeter/?ref_=nv_mv_mpm'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'lxml')

movies = soup.select('td.titleColumn')
links = [a.attrs.get('href') for a in soup.select('td.titleColumn a')]
crew = [a.attrs.get('title') for a in soup.select('td.titleColumn a')]

ratings = [b.attrs.get('data-value')
           for b in soup.select('td.posterColumn span[name=ir]')]

votes = [b.attrs.get('data-value')
         for b in soup.select('td.ratingColumn strong')]

# Iterating over movies to extract
# each movie's details
data = {}
for index in range(0, len(movies)):

    # Separating movie into: 'place',
    # 'title', 'year'
    movie_string = movies[index].get_text()
    # print(movie_string)
    movie = (' '.join(movie_string.split()).replace('.', ''))
    r = re.compile('\((.*?)\)')
    year = list(filter(r.match, movie_string.split()))
    if len(year) > 0:
        year = year[0][1:5]
    else:
        year = " "
    movie_title = movie[len(str(index))+1:-7]
    data[index] = {"movie_title": movie,
                    "year": year,
                    "star_cast": crew[index],
                    "rating": ratings[index]}

json_object = json.dumps(data, indent=4)
print(json_object)

