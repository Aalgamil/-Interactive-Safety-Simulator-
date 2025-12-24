@echo off
echo Starting backend server...
cd /d "c:\Users\bdalr\Downloads\Interactive Safety Simulator"
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
python server.py
pause
