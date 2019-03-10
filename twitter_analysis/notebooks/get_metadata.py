import tweepy
import json
import math
import glob
import csv
import zipfile
import zlib
from tweepy import TweepError
from time import sleep
import os


def is_retweet(entry):
    return 'retweeted_status' in entry.keys()


def get_source(entry):
    if '<' in entry["source"]:
        return entry["source"].split('>')[1].split('<')[0]
    else:
        return entry["source"]

########## API Keys ##############
with open('api_keys.json') as f:
    keys = json.load(f)

auth = tweepy.OAuthHandler(keys['consumer_key'], keys['consumer_secret'])
auth.set_access_token(keys['access_token'], keys['access_token_secret'])
api = tweepy.API(auth)


def get_metadata(user, output_path=None):
    # CHANGE THIS TO THE USER YOU WANT
    #user = 'elonmusk'
    user = user.lower()
    if not output_path:
        output_path = '/Users/nesara/Documents/aim/git/articles/twitter_analysis/data/'

    user_dir_path = output_path + user
    if not os.path.exists(user_dir_path):
        os.makedirs(user_dir_path)
    user_dir_path = user_dir_path + "/"

    output_file = user_dir_path + '{}.json'.format(user)
    output_file_short = user_dir_path + '{}_short.json'.format(user)
    #compression = zipfile.ZIP_DEFLATED
    profile_info_file = user_dir_path + '{}_profile.json'.format(user)
    output_csv_file = user_dir_path + '{}.csv'.format(user)

    with open(user_dir_path + 'all_ids.json') as f:
        ids = json.load(f)

    print('total ids: {}'.format(len(ids)))

    all_data = []
    start = 0
    end = 100
    limit = len(ids)
    i = math.ceil(limit / 100)

    for go in range(i):
        print('currently getting {} - {}'.format(start, end))
        sleep(6)  # needed to prevent hitting API rate limit
        id_batch = ids[start:end]
        start += 100
        end += 100
        tweets = api.statuses_lookup(id_batch)
        for tweet in tweets:
            all_data.append(dict(tweet._json))

    print('metadata collection complete')
    print('creating master json file')
    with open(output_file, 'w') as outfile:
        json.dump(all_data, outfile)

    """
    print('creating ziped master json file')
    zf = zipfile.ZipFile('{}.zip'.format(user), mode='w')
    zf.write(output_file, compress_type=compression)
    zf.close()
    """

    ###### Get user profile info #########
    results = []
    with open(output_file) as json_data:
        data = json.load(json_data)
        for entry in data:
            t = {
                "name": entry["user"]["name"],
                "screen_name": entry["user"]["screen_name"],
                "followers_count": entry["user"]["followers_count"],
                "friends_count": entry["user"]["friends_count"],
                "listed_count": entry["user"]["listed_count"],
                "favourites_count": entry["user"]["favourites_count"],
                "created_at": entry["user"]["created_at"],
                "statuses_count": entry["user"]["statuses_count"]
            }
            results.append(t)

    print('creating profile info file')
    with open(profile_info_file, 'w') as outfile:
        json.dump(results, outfile)

    ######### Get tweet info ###########
    results = []
    with open(output_file) as json_data:
        data = json.load(json_data)
        for entry in data:
            t = {
                "created_at": entry["created_at"],
                "text": entry["text"],
                "in_reply_to_screen_name": entry["in_reply_to_screen_name"],
                "retweet_count": entry["retweet_count"],
                "favorite_count": entry["favorite_count"],
                "source": get_source(entry),
                "is_retweet": is_retweet(entry),
                "geo": entry["geo"],
                "coordinates": entry["coordinates"],
                "place": entry["place"]
            }
            results.append(t)

    print('creating minimized json master file')
    with open(output_file_short, 'w') as outfile:
        json.dump(results, outfile)

    with open(output_file_short) as master_file:
        data = json.load(master_file)
        fields = ["favorite_count", "source", "text", "in_reply_to_screen_name",
                  "is_retweet", "created_at", "retweet_count", "geo", "coordinates", "place"]
        print('creating CSV version of minimized json master file')
        f = csv.writer(open(output_csv_file, 'w'))
        f.writerow(fields)
        for x in data:
            f.writerow([x["favorite_count"], x["source"], x["text"], x["in_reply_to_screen_name"],
                        x["is_retweet"], x["created_at"], x["retweet_count"], x["geo"], x["coordinates"], x["place"]])
