del /s /q .\build
rmdir /s /q .\build

del /s /q .\dist
rmdir /s /q .\dist

pyinstaller -D .\server.py --add-data assets:assets --add-data css:css --add-data js:js --add-data views:views
pause