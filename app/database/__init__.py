import psycopg2
from sqlalchemy import create_engine

# run local
DATABASE_URI = 'postgres+psycopg2://postgres:dothikimlien@localhost:5432/disease_climate'


# run server heroku
# DATABASE_URI = "postgres+psycopg2://tvqjdyckqrural:3b4a9ab4b9c565a2df83b3628409943697424cedff70b5548d5a2f419271e5d0@ec2-52-206-15-227.compute-1.amazonaws.com:5432/d9pccbvvlghtc"

def configure():
    engine = create_engine(DATABASE_URI)

    conn = engine.connect()

    return conn
