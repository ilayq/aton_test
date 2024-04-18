from pydantic import BaseModel
from datetime import date


class PlotDTO(BaseModel):
    countries: list[str]
    start_date: date
    end_date: date


class CurrencyDTO(BaseModel):
    country: str
    currency_name: str
    currency_code: str | None = None
