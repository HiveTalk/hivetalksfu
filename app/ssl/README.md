## Self-signed certificate

[What is self-signed-certificate](https://en.wikipedia.org/wiki/Self-signed_certificate)

![mirotalksfu-https](https.png)

```bash
# install openssl 4 ubuntu
apt install openssl
# install openssl 4 mac
brew install openssl

# self-signed certificate
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem

# https://www.sslchecker.com/certdecoder
```

For trusted certificate, take a look at [Let's Encrypt](https://letsencrypt.org/i) and [Certbot](https://certbot.eff.org/).
