"""Configuration helpers for ml-service."""
from dataclasses import dataclass
from pathlib import Path


@dataclass
class Config:
    data_dir: Path = Path("/data")
    tmp_dir: Path = Path("/tmp")


def get_config() -> Config:
    """Return a default config instance. Extend to load from env/files."""
    return Config()
