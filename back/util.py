from datetime import date
from dataclasses import dataclass


@dataclass
class DatasetUnit:
    currency_code: str
    d: date
    amount: int
    cost: float
    delta: float
