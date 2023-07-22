import mysql.connector
from mysql.connector import errorcode
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import json
from subprocess import Popen, PIPE


config = {
    'user': 'root',
    'password': 'Nnd09082001*',
    'host': '127.0.0.1',
    'database': 'database - db',
    'raise_on_warnings': True

}

try:
    cnx = mysql.connector.connect(**config)

except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Something is wrong with your user name or password")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database 📂 does not exist ❌")
    else:
        print(err)

else:
    # print("Connected the database 📂..")
    recommend_arr = []
    count_diff_users_dict = {}
    cursor = cnx.cursor()

    with open('C:/Users/HP/Desktop/formList.json') as f:
        result_data = json.load(f)

    active_user = result_data['User']
    movie_title = result_data['movie_title']

    query = f"SELECT rating FROM tracker where user_id in (select user_id from tracker where title = " \
            f"'{movie_title}') and user_id = {active_user};"
    cursor.execute(query)
    selected_movie_rating = -1
    for i in cursor:
        selected_movie_rating = i

    action_lover = [(movie_title, selected_movie_rating[0])]

    query = f"SELECT user_id, title, rating FROM tracker where user_id in (select user_id from tracker where title = " \
            f"'{action_lover[0][0]}') and user_id != {active_user};"
    cursor.execute(query)
    for (user_id, title, rating) in cursor:
        recommend_arr.append((user_id, title, rating))

    for i in recommend_arr:
        if count_diff_users_dict.get(i[0]) is None:
            count_diff_users_dict[i[0]] = True

    if len(count_diff_users_dict) > 1:
        # print(recommend_arr)

        ratings = pd.DataFrame(recommend_arr, columns=['user_id', 'title', 'rating'])
        # print(ratings.head())

        user_ratings = ratings.pivot_table(index=['user_id'], columns=['title'], values='rating')
        user_ratings = user_ratings.dropna(thresh=1, axis=1).fillna(0)
        # print(user_ratings.head(20))


        def standardize(row):
            new_row = (row - row.mean()) / row.std()
            return new_row


        ratings_std = user_ratings.apply(standardize)
        # print(ratings_std)

        # We are taking a transpose since we want similarity between items which need to be in rows
        item_similarity = cosine_similarity(ratings_std.T)
        # print(item_similarity)

        item_similarity_df = pd.DataFrame(item_similarity, index=user_ratings.columns, columns=user_ratings.columns)
        item_similarity_df = item_similarity_df.rename_axis(None)
        item_similarity_df = item_similarity_df.rename_axis(None, axis=1)
        # print(item_similarity_df)


        def get_similar_movies(movie_name, user_rating):
            similar_score = item_similarity_df[movie_name]*(user_rating - 2.5)
            similar_score = similar_score.sort_values(ascending=False)
            return similar_score


        # print(get_similar_movies("romantic3", 1))
        similar_movies = pd.DataFrame()

        for i, (movie, rating) in enumerate(action_lover):
            similar_movies = similar_movies.append(get_similar_movies(movie, rating), ignore_index=True)

        # print(similar_movies.head())
        # print(similar_movies.sum().sort_values(ascending=False))
        arr = [similar_movies.columns.values.tolist()] + [similar_movies.sum().sort_values(ascending=False).tolist()]

        movies_rec = arr[0]
        points_rec = arr[1]

        for i in action_lover:
            if i[0] in movies_rec:
                points_rec.pop(movies_rec.index(i[0]))
                movies_rec.remove(i[0])

        mean_rating = 0
        for i in points_rec:
            mean_rating += i

        # print(mean_rating)

        mean_rating = mean_rating / len(points_rec)

        for i in points_rec:
            if i < mean_rating:
                movies_rec.pop(points_rec.index(i))
                points_rec.remove(i)

        query = f"SELECT title, poster FROM tracker where user_id in (select user_id from tracker where title = " \
                f"'{action_lover[0][0]}') and user_id != {active_user};"
        cursor.execute(query)
        poster_arr = []
        for (title, poster) in cursor:
            poster_arr.append((title, poster))

        # print(arr)
        arr_After_rec = {}
        for i in range(len(poster_arr)):
            if poster_arr[i][0] in movies_rec:
                if arr_After_rec.get(poster_arr[i][0]) is None:
                    arr_After_rec[poster_arr[i][0]] = poster_arr[i][1]

        # print()
        # print("Closing connection 👋..")
        cnx.close()

        json_object = json.dumps(arr_After_rec, indent=4)
        print(json_object)
