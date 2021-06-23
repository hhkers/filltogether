nohup python manage.py runserver 0.0.0.0:8000 > logs/server.log  2> logs/error.log &
echo $! > pid.txt
