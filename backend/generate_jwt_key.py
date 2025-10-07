#!/usr/bin/env python3
import secrets
import string

# Generate 128-character JWT key
chars = string.ascii_letters + string.digits + "!@#$%^&*"
jwt_key = ''.join(secrets.choice(chars) for _ in range(128))
print(f"JWT_128_KEY={jwt_key}")
