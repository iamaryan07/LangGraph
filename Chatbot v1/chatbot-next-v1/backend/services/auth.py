from fastapi import Header, HTTPException
from jose import jwt, JWTError
from dotenv import load_dotenv
import requests

import os

load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")

JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"


def get_jwks():
    return requests.get(JWKS_URL).json()

def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code= 401,
            detail= "Missing token"
        )
    
    try:
        token = authorization.split(" ")[1]

        header = jwt.get_unverified_header(token)

        kid = header.get("kid")

        jwks = get_jwks()

        key = next(
            (k for k in jwks["keys"] if k["kid"] == kid),
            None
        )

        if not key:
            raise HTTPException(
                status_code=401,
                detail="Public key not found"
            )

        payload = jwt.decode(
            token,
            key,
            algorithms=["ES256"],
            audience="authenticated"
        )

        return payload
    
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )