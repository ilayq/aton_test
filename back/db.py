from sqlite3 import connect
from util import DatasetUnit
from typing import Callable
from config import currencies2finmarket_code
from Parser import Parser
from datetime import date


class DataBase:
    def __init__(self):
        try:
            con = connect('db.db')
            cur = con.cursor()
            cur.execute('select * from absolute_changes')
            cur.execute('select * from metadata')
            cur.execute('select * from relative_changes')
            cur.close()
            con.close()
        except Exception as e:
            cur.close()
            con.close()
            self.__init_db()

    def __init_db(self):
        con = connect('db.db')
        cur = con.cursor()
        cur.execute('create table metadata(currency_code text primary key, base_date text, base_cost real)')
        cur.execute('create table absolute_changes(currency_code text, date text, value real, primary key(currency_code, date))')
        cur.execute('create table relative_changes(currency_code text, date text, value real, primary key(currency_code, date))')
        for code in currencies2finmarket_code:
            base_cost = Parser().parse_dataset(code, date(year=2022, month=5, day=20), date(year=2022, month=5, day=30))
            cur.execute(f"insert into metadata(currency_code, base_date, base_cost) values ('{code}', {date(year=2022, month=5, day=20)}, {base_cost[0].cost})")

        con.commit()
        cur.close()
        con.close()

    def sync(self, ds: list[DatasetUnit]) -> None:
        con = connect('db.db')
        cur = con.cursor()
        base_cost = cur.execute(f"select base_cost from metadata where currency_code = '{ds[0].currency_code}'").fetchone()[0]

        ds_unit2absolute: Callable[[DatasetUnit], tuple[str, date, float]] = lambda unit: (unit.currency_code, unit.d, unit.cost)

        ds_unit2relative: Callable[[DatasetUnit], tuple[str, date, float]] = lambda unit: (unit.currency_code, unit.d, unit.cost - base_cost)
        
        cur.executemany('insert or ignore into absolute_changes(currency_code, date, value) values (?, ?, ?)', map(ds_unit2absolute, ds))
        cur.executemany('insert or ignore into relative_changes(currency_code, date, value) values (?, ?, ?)', map(ds_unit2relative, ds))
        con.commit()
        cur.close()
        con.close()
