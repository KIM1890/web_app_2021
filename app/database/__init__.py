import psycopg2
from sqlalchemy import create_engine

# run local
DATABASE_URI = 'postgres+psycopg2://postgres:dothikimlien@localhost:5432/disease_climate'


# run server heroku
# DATABASE_URI = "postgres://dmzhyjajukbowc:b753ce0d49f92406172510195608dfcd6c21a1c81e913ce3d388bbe5d2c2167f@ec2-54-242-120-138.compute-1.amazonaws.com:5432/d6omo716ohp05r"

def configure():
    engine = create_engine(DATABASE_URI)

    conn = engine.connect()

    return conn
