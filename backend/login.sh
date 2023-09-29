curl \
-v \
-H "Content-Type: multipart/form-data" \
-X POST \
-F "username=manuel.holtgrewe@bih-charite.de" \
-F "password=password" \
http://localhost:8080/api/v1/auth/cookie/login
