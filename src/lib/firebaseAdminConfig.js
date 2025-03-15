import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "maktabati-e65bd",
        "private_key_id": "1bab9fe1446746750282e77893b83f6a758f3b01",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCpnV/ZWufwFEhg\ntnipom3p91zWsgOb/yH5OkxmDmm5QQc4nCchrWnlfhucbS3zDB2C4DND7kizlIru\neOi6mfScfDdg7YpPARuGrlVJDYU4WzPWo8S3xhxcFTCscbTR1fSXhIBvL2iMu8QW\nqq20q94ceSe1wROVnIoJTTVV8Zpo9zOlr7bjz3/OOgdGxUmbc5fRNait30vnOwSB\n3vP0ZGKqcu92AdaF+uDjvg11VVUeQxpLtCpJUMH7IK+Y9WY7DKYg9hPGmmzqfAo1\n5yFp23LjyVsm/M34dTI+Jw/51DWNQeRzh1d/AqoWEwohJ8l1YxlzTkjUlAfZle9r\nZRd4XNMDAgMBAAECggEATWR9GTDFFwMyOUrZSNHQJEsVxfLo+bOS/WTv+jtGW1zE\nHj0GD/RQFwKRN7GLn1ReXNrPGYZvDt3O/NwXmRlph0OYgzYv/zeKp0wBpzkvmdTn\nlN8aAh63zv5uPKkPcBWXqtEvR0xTALAmW49afk9TpBtWFrU4KfKI+5CKryH0KkMv\nWGtns77PYh0PrqxRHGqYxHWjHXw+GhGv7fJ/2k9sU61ioR1zuhivyGIYwbOn6KE+\nN3BdhAG3oiuboFsAiCt3Z3zkj7myCwGX0neg+DSV5U6NTGxAtaBh5MwlDidgZsPh\nUjCJA7MH4ezJpATCYDYw5fwYGWvVBSGHDMhv2lz4BQKBgQDRKrnpC2uvSuSFKV6Q\n6ia6lZVtik51ZdxLkMJYTGi2nbg8VcP7t6qsnMIinK93jMxw9uFfy8r1kJsKBppD\n+vwWZY/saZXCYOZvJQk2vgDRCb7Mfi44DPHN9SZyOi4+GwciSt1R+1rRwXAMMHcP\ntaLINWCXnKlHIeLvvAWZm8xeFwKBgQDPl40kYa0bd+fd3S132+596msVoOBx2A4O\nwT6HJV4WL8EYqYKc2bithjhPD8JfTBW9qW8fFe4J6xmY9AsBR+b1kpHX/7CP1rDl\nHNTC6WkWqm0Wc8AjVXC94J6PrjkmHVVPKhLaGIdfeihTs0wCAd7ckY4vvDENB4zi\nXIVhgnrR9QKBgCuh1Qw3FKyJW+gnPBHQtml/oJ8sFbfJms2skc3nioRlnDQB1BMj\nOhgtzxV3R+cRWOhLp7HbCih1lNHflLiPl5x4bTBsyg+1NPyEZkqkEfmJJeL0g2Gv\n2ZUUCYQUfOb5rmBJ66cZXtWYm23/gialxiIreE3IIUu0VumZeDWV2WjbAoGAOf3Y\nTAWNWlMQzwXuocEqyrol2BDtImB87NpHIXHq6r/EbaNM/YxE7xTDvjJk1kJnAGjI\nxiJWMScgK35hZKY1evzLCVBAfq43FIoNVbXmyZIqj08eqcBAkoqhQPomtOMU5dyX\nD54ykxWJFnjMDvN+0pdG5UbpXP5y+PlnuWm97dECgYEAt3r4VO1mtxME5v/XCYu5\nXC6YfcyyEw0q0oVsZ8KTXo+R3Lh3Vvv8sQkY2mJ1jrCfX2HtxqOnffDe5xO9hqjk\nGsB5cV/J/gtmgK0Mgf9IScfdiceQEWE613Siq5sW3XpfWQjjXSS6QRwLU7mtya+l\nw8lu/BC3QtVULCRXMNHHzI8=\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-fbsvc@maktabati-e65bd.iam.gserviceaccount.com",
        "client_id": "103151717549472860796",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40maktabati-e65bd.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
      }
      ),
  });
}

const db = admin.firestore();

export {admin, db };
