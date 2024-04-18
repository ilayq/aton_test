from config import currencies2finmarket_code
from dto import CurrencyDTO
from util import DatasetUnit

from datetime import date, datetime
import requests
from bs4 import BeautifulSoup


class Parser:
    finmarket_url = 'https://www.finmarket.ru/currency/rates/?pv=1'
    iban_url = 'https://www.iban.ru/currency-codes'

    @staticmethod
    def parse_dataset(currency_code: str, period_start: date, period_end: date) -> list[DatasetUnit]:
        html = ''
        q_params = {
            'cur': currencies2finmarket_code[currency_code],
            'ed': period_end.day,
            'em': period_end.month,
            'ey': period_end.year,
            'bd': period_start.day,
            'bm': period_start.month,
            'by': period_start.year
        }
        response = requests.get(Parser.finmarket_url, params=q_params)

        for byte in response:  # direct decoding causes error
            html += byte.decode('cp1251')

        soup = BeautifulSoup(html, features='html.parser')

        tbody_tag = soup.find('tbody')
        result = []
        for tr_tag in tbody_tag.find_all('tr'):
            d, amount, cost, delta = map(lambda tag: tag.get_text(), tr_tag.find_all('td'))
            dt = datetime.strptime(d, '%d.%m.%Y')
            result.append(DatasetUnit(currency_code, dt.date(), int(amount), float(cost.replace(',', '.')), float(delta.replace(',', '.'))))

        return result

    @staticmethod
    def currency_list() -> list[CurrencyDTO]:
        response = requests.get(Parser.iban_url)
        soup = BeautifulSoup(response.text)
        tbody_tag = soup.find('tbody')
        result = []
        for tr_tag in tbody_tag.find_all('tr'):
            data = list(map(lambda tag: tag.get_text(), tr_tag.find_all('td')))
            if len(data) == 4:
                country, currency_name, currency_code, _ = data
            else:
                country, currency_name, currency_code, _ = data + [None, None]
            result.append(CurrencyDTO(
                country=country,
                currency_name=currency_name,
                currency_code=currency_code
            ))
        return result
