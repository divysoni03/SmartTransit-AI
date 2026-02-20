"""Runtime settings for ml-service."""
from dataclasses import dataclass


@dataclass
class Settings:
    env: str = "development"
    debug: bool = True


settings = Settings()
