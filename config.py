from decouple import config

class Config:
    SECRET_KEY = config('SECRET_KEY')
    MONGODB_URI = config('MONGODB')
    MEDICHECK_DB_NAME = config('MEDICHECK_DB_NAME')